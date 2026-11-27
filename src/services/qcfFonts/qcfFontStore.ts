import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import {
  QCF_FONT_BASE_URLS,
  QCF_FONT_DOWNLOAD_ATTEMPTS,
  QCF_FONT_DOWNLOAD_CONCURRENCY,
  QCF_FONT_MIN_BYTES,
  QCF_FONTS_VERSION,
  QCF_TOTAL_PAGES,
} from './constants';
import {getPageQCFontName} from '../../content/quran';

const FONTS_DIR = `${FileSystem.documentDirectory}qcf-fonts/${QCF_FONTS_VERSION}/`;
/** Written once every page font is on disk, so later launches skip the scan. */
const COMPLETE_MARKER = `${FONTS_DIR}complete.json`;

/** Font family name a page's QCF font is registered under (both platforms). */
export const getQcfFontFamily = getPageQCFontName;

export const getQcfFontFileUri = (pageNumber: number): string =>
  `${FONTS_DIR}p${pageNumber}.ttf`;

const isValidPage = (pageNumber: number) =>
  Number.isInteger(pageNumber) &&
  pageNumber >= 1 &&
  pageNumber <= QCF_TOTAL_PAGES;

let dirReady: Promise<void> | null = null;
const ensureFontsDir = (): Promise<void> => {
  if (!dirReady) {
    dirReady = (async () => {
      const info = await FileSystem.getInfoAsync(FONTS_DIR);
      if (!info.exists) {
        await FileSystem.makeDirectoryAsync(FONTS_DIR, {intermediates: true});
      }
    })().catch(error => {
      dirReady = null;
      throw error;
    });
  }
  return dirReady;
};

// TrueType files start with 0x00010000 ("AAEAAA" in base64).
const TTF_MAGIC_BASE64_PREFIX = 'AAEAAA';

const hasTrueTypeHeader = async (uri: string): Promise<boolean> => {
  try {
    const head = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
      position: 0,
      length: 4,
    });
    return head.startsWith(TTF_MAGIC_BASE64_PREFIX);
  } catch {
    return false;
  }
};

/** Pages whose font file is already on disk (verified this session). */
const verifiedOnDisk = new Set<number>();

const isFontFileOnDisk = async (pageNumber: number): Promise<boolean> => {
  if (verifiedOnDisk.has(pageNumber)) {
    return true;
  }
  const info = await FileSystem.getInfoAsync(getQcfFontFileUri(pageNumber));
  if (
    info.exists &&
    !info.isDirectory &&
    (info.size ?? 0) >= QCF_FONT_MIN_BYTES
  ) {
    verifiedOnDisk.add(pageNumber);
    return true;
  }
  return false;
};

const getHeader = (
  headers: Record<string, string> | undefined,
  name: string,
): string | undefined => {
  if (!headers) {
    return undefined;
  }
  const key = Object.keys(headers).find(
    header => header.toLowerCase() === name,
  );
  return key ? headers[key] : undefined;
};

/**
 * Downloads one page font to a `.part` file, verifies it (HTTP 200, size
 * matches Content-Length when the server sends one, minimum size, TrueType
 * header), then moves it into place so a killed process never leaves a
 * truncated font that a later run would trust.
 */
const downloadFontFile = async (pageNumber: number): Promise<void> => {
  await ensureFontsDir();
  const target = getQcfFontFileUri(pageNumber);
  const part = `${target}.part`;
  let lastError: unknown = new Error(`No font hosts for page ${pageNumber}`);

  for (const base of QCF_FONT_BASE_URLS) {
    for (let attempt = 1; attempt <= QCF_FONT_DOWNLOAD_ATTEMPTS; attempt++) {
      try {
        await FileSystem.deleteAsync(part, {idempotent: true});
        const result = await FileSystem.downloadAsync(
          `${base}/p${pageNumber}.ttf`,
          part,
        );
        if (result.status !== 200) {
          throw new Error(`HTTP ${result.status}`);
        }
        const info = await FileSystem.getInfoAsync(part);
        const size = info.exists ? info.size ?? 0 : 0;
        const expected = Number(getHeader(result.headers, 'content-length'));
        // Content-Length is only trustworthy for uncompressed responses.
        const encoding = getHeader(result.headers, 'content-encoding');
        if (
          !encoding &&
          Number.isFinite(expected) &&
          expected > 0 &&
          size !== expected
        ) {
          throw new Error(`size ${size} != content-length ${expected}`);
        }
        if (size < QCF_FONT_MIN_BYTES) {
          throw new Error(`font too small (${size} bytes)`);
        }
        if (!(await hasTrueTypeHeader(part))) {
          throw new Error('not a TrueType file');
        }
        await FileSystem.deleteAsync(target, {idempotent: true});
        await FileSystem.moveAsync({from: part, to: target});
        verifiedOnDisk.add(pageNumber);
        return;
      } catch (error) {
        lastError = error;
      }
    }
  }

  await FileSystem.deleteAsync(part, {idempotent: true}).catch(() => {});
  throw new Error(
    `Failed to download QCF font for page ${pageNumber}: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
};

/** One in-flight download per page, shared by the bulk and on-demand paths. */
const inflightDownloads = new Map<number, Promise<void>>();

export const ensurePageFontDownloaded = (pageNumber: number): Promise<void> => {
  const existing = inflightDownloads.get(pageNumber);
  if (existing) {
    return existing;
  }
  const task = (async () => {
    if (await isFontFileOnDisk(pageNumber)) {
      return;
    }
    await downloadFontFile(pageNumber);
  })().finally(() => {
    inflightDownloads.delete(pageNumber);
  });
  inflightDownloads.set(pageNumber, task);
  return task;
};

/** Registry so Font.loadAsync runs at most once per page per app session. */
const loadedFonts = new Set<number>();
const loadingFonts = new Map<number, Promise<void>>();
type FontListener = (pageNumber: number) => void;
const listeners = new Set<FontListener>();

export const isPageFontLoaded = (pageNumber: number): boolean =>
  loadedFonts.has(pageNumber);

export const subscribeToPageFontLoads = (listener: FontListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Makes a page's QCF font usable in <Text fontFamily>: downloads it if it
 * isn't cached yet (jumping ahead of the bulk download queue), then
 * registers it with expo-font from the local file. Safe to call repeatedly.
 */
export const ensurePageFontLoaded = (pageNumber: number): Promise<void> => {
  if (!isValidPage(pageNumber) || loadedFonts.has(pageNumber)) {
    return Promise.resolve();
  }
  const existing = loadingFonts.get(pageNumber);
  if (existing) {
    return existing;
  }
  const task = (async () => {
    await ensurePageFontDownloaded(pageNumber);
    const family = getQcfFontFamily(pageNumber);
    if (!Font.isLoaded(family)) {
      await Font.loadAsync({[family]: getQcfFontFileUri(pageNumber)});
    }
    loadedFonts.add(pageNumber);
    listeners.forEach(listener => listener(pageNumber));
  })().finally(() => {
    loadingFonts.delete(pageNumber);
  });
  loadingFonts.set(pageNumber, task);
  return task;
};

export interface QcfFontsDownloadProgress {
  fontsCompleted: number;
  totalFonts: number;
}

/** Pages not yet on disk, so callers can skip work and report resume progress. */
export const listMissingPageFonts = async (): Promise<number[]> => {
  await ensureFontsDir();
  const entries = new Set(await FileSystem.readDirectoryAsync(FONTS_DIR));
  const missing: number[] = [];
  for (let page = 1; page <= QCF_TOTAL_PAGES; page++) {
    if (verifiedOnDisk.has(page)) {
      continue;
    }
    if (entries.has(`p${page}.ttf`) && (await isFontFileOnDisk(page))) {
      continue;
    }
    missing.push(page);
  }
  return missing;
};

/**
 * Downloads every page font that isn't cached yet (resumable: completed
 * files are skipped). Stops at the first page that fails on every host so an
 * offline device fails fast instead of retrying 604 times.
 */
export const downloadAllPageFonts = async (
  onProgress?: (progress: QcfFontsDownloadProgress) => void,
): Promise<void> => {
  const marker = await FileSystem.getInfoAsync(COMPLETE_MARKER);
  if (marker.exists) {
    onProgress?.({
      fontsCompleted: QCF_TOTAL_PAGES,
      totalFonts: QCF_TOTAL_PAGES,
    });
    return;
  }
  const missing = await listMissingPageFonts();
  let fontsCompleted = QCF_TOTAL_PAGES - missing.length;
  onProgress?.({fontsCompleted, totalFonts: QCF_TOTAL_PAGES});

  let cursor = 0;
  let failure: unknown = null;
  const runners = Array.from(
    {length: Math.min(QCF_FONT_DOWNLOAD_CONCURRENCY, missing.length)},
    async () => {
      while (failure === null && cursor < missing.length) {
        const page = missing[cursor++];
        try {
          await ensurePageFontDownloaded(page);
          fontsCompleted += 1;
          onProgress?.({fontsCompleted, totalFonts: QCF_TOTAL_PAGES});
        } catch (error) {
          failure = error;
        }
      }
    },
  );
  await Promise.all(runners);
  if (failure !== null) {
    throw failure;
  }
  await FileSystem.writeAsStringAsync(
    COMPLETE_MARKER,
    JSON.stringify({version: QCF_FONTS_VERSION, count: QCF_TOTAL_PAGES}),
  );
};
