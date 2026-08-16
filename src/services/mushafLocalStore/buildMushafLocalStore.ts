import * as FileSystem from 'expo-file-system';
import {fetchChapters} from '../clients/quranCdnClient';
import {
  MUSHAF_BUILD_CONCURRENCY,
  MUSHAF_BUILD_PAGE_RETRY_ATTEMPTS,
  MUSHAF_DATA_VERSION,
  MUSHAF_TOTAL_PAGES,
} from './constants';
import {
  clearDir,
  ensureDirExists,
  listCompletedTempPageNumbers,
  mushafLocalStorePaths,
  readJson,
  tempPagePath,
  writeJsonAtomic,
} from './paths';
import {buildMushafPage, MushafPageBuildResult} from './buildMushafPage';
import {
  MushafLocalStoreBuildProgress,
  MushafLocalStoreData,
  MushafLocalStoreMeta,
  MushafLocalStoreStatus,
  MushafSurahLocator,
} from '../../types/mushaf-local-store.types';

const readMeta = async (): Promise<MushafLocalStoreMeta | null> => {
  const info = await FileSystem.getInfoAsync(mushafLocalStorePaths.META_PATH);
  if (!info.exists) {
    return null;
  }
  try {
    return await readJson<MushafLocalStoreMeta>(mushafLocalStorePaths.META_PATH);
  } catch {
    // Corrupt meta file — treat as if it never existed.
    return null;
  }
};

const writeMeta = (meta: MushafLocalStoreMeta): Promise<void> =>
  writeJsonAtomic(mushafLocalStorePaths.META_PATH, meta);

/**
 * `ready` — a complete, current-version store exists and can be loaded as-is.
 * `stale` — a store exists but for a different data version; must be wiped and rebuilt.
 * `missing` — no complete store yet, either first launch or a resumable partial build.
 */
export const getMushafLocalStoreStatus =
  async (): Promise<MushafLocalStoreStatus> => {
    const meta = await readMeta();

    if (!meta) {
      return 'missing';
    }
    if (meta.version !== MUSHAF_DATA_VERSION) {
      return 'stale';
    }
    if (!meta.complete) {
      return 'missing';
    }

    const dataInfo = await FileSystem.getInfoAsync(mushafLocalStorePaths.DATA_PATH);
    return dataInfo.exists ? 'ready' : 'missing';
  };

export const loadMushafLocalStore =
  async (): Promise<MushafLocalStoreData | null> => {
    const info = await FileSystem.getInfoAsync(mushafLocalStorePaths.DATA_PATH);
    if (!info.exists) {
      return null;
    }
    return readJson<MushafLocalStoreData>(mushafLocalStorePaths.DATA_PATH);
  };

const buildSurahMap = (
  chapters: Awaited<ReturnType<typeof fetchChapters>>,
): Record<number, MushafSurahLocator> => {
  const surahMap: Record<number, MushafSurahLocator> = {};
  for (const chapter of chapters) {
    surahMap[chapter.id] = {
      surah: chapter.id,
      nameArabic: chapter.name_arabic,
      startPage: chapter.pages[0],
      endPage: chapter.pages[1],
      ayahCount: chapter.verses_count,
      type: chapter.revelation_place === 'makkah' ? 'meccan' : 'medinan',
    };
  }
  return surahMap;
};

const fetchPageWithRetry = async (
  pageNumber: number,
): Promise<MushafPageBuildResult> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MUSHAF_BUILD_PAGE_RETRY_ATTEMPTS; attempt++) {
    try {
      return await buildMushafPage(pageNumber);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

/** Runs `worker` over `items` with at most `concurrency` in flight at once. */
const runWithConcurrency = async <T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
): Promise<void> => {
  let cursor = 0;
  const runners = Array.from(
    {length: Math.min(concurrency, items.length)},
    async () => {
      while (cursor < items.length) {
        const index = cursor++;
        await worker(items[index]);
      }
    },
  );
  await Promise.all(runners);
};

export interface BuildMushafLocalStoreOptions {
  onProgress?: (progress: MushafLocalStoreBuildProgress) => void;
}

/**
 * Returns the current Mushaf Local Store, building it first if needed.
 *
 * If a complete, current-version store already exists, it's loaded and
 * returned immediately with no network activity. Otherwise this downloads
 * every page from the Quran.com CDN, resuming from whatever pages were
 * already fetched in a previous, interrupted attempt at the same data
 * version, then assembles and persists the final store.
 */
export const buildMushafLocalStore = async (
  options: BuildMushafLocalStoreOptions = {},
): Promise<MushafLocalStoreData> => {
  const {onProgress} = options;
  const report = (progress: MushafLocalStoreBuildProgress) =>
    onProgress?.(progress);

  report({phase: 'checking', pagesCompleted: 0, totalPages: MUSHAF_TOTAL_PAGES});

  const status = await getMushafLocalStoreStatus();
  if (status === 'ready') {
    const store = await loadMushafLocalStore();
    if (store) {
      report({
        phase: 'ready',
        pagesCompleted: MUSHAF_TOTAL_PAGES,
        totalPages: MUSHAF_TOTAL_PAGES,
      });
      return store;
    }
  }

  await ensureDirExists(mushafLocalStorePaths.ROOT_DIR);

  if (status === 'stale') {
    await clearDir(mushafLocalStorePaths.TMP_DIR);
    await FileSystem.deleteAsync(mushafLocalStorePaths.DATA_PATH, {
      idempotent: true,
    });
  }

  await ensureDirExists(mushafLocalStorePaths.TMP_DIR);
  // Stamp an in-progress build at the current version so a killed process
  // resumes into temp files it can trust, instead of mistaking a partial
  // build from a previous data version for one it can resume.
  await writeMeta({version: MUSHAF_DATA_VERSION, complete: false});

  report({
    phase: 'downloading-chapters',
    pagesCompleted: 0,
    totalPages: MUSHAF_TOTAL_PAGES,
  });
  const chapters = await fetchChapters();
  const surahMap = buildSurahMap(chapters);

  const completedPages = await listCompletedTempPageNumbers();
  const allPageNumbers = Array.from(
    {length: MUSHAF_TOTAL_PAGES},
    (_, index) => index + 1,
  );
  const pendingPageNumbers = allPageNumbers.filter(
    page => !completedPages.has(page),
  );

  let pagesCompleted = completedPages.size;
  report({
    phase: 'downloading-pages',
    pagesCompleted,
    totalPages: MUSHAF_TOTAL_PAGES,
  });

  try {
    await runWithConcurrency(
      pendingPageNumbers,
      MUSHAF_BUILD_CONCURRENCY,
      async pageNumber => {
        const result = await fetchPageWithRetry(pageNumber);
        await writeJsonAtomic(tempPagePath(pageNumber), result);
        pagesCompleted += 1;
        report({
          phase: 'downloading-pages',
          pagesCompleted,
          totalPages: MUSHAF_TOTAL_PAGES,
        });
      },
    );
  } catch (error) {
    report({
      phase: 'error',
      pagesCompleted,
      totalPages: MUSHAF_TOTAL_PAGES,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to download mushaf data',
    });
    throw error;
  }

  report({
    phase: 'finalizing',
    pagesCompleted: MUSHAF_TOTAL_PAGES,
    totalPages: MUSHAF_TOTAL_PAGES,
  });

  const pages: MushafLocalStoreData['pages'] = {};
  const ayahText: MushafLocalStoreData['ayahText'] = {};
  const ayahMap: MushafLocalStoreData['ayahMap'] = {};
  const pageMap: MushafLocalStoreData['pageMap'] = {};

  for (const pageNumber of allPageNumbers) {
    const result = await readJson<MushafPageBuildResult>(
      tempPagePath(pageNumber),
    );
    pages[pageNumber] = result.words;
    pageMap[pageNumber] = result.pageSurahRanges;
    Object.assign(ayahText, result.ayahText);
    Object.assign(ayahMap, result.ayahMap);
  }

  const store: MushafLocalStoreData = {
    version: MUSHAF_DATA_VERSION,
    pages,
    ayahText,
    ayahMap,
    surahMap,
    pageMap,
  };

  await writeJsonAtomic(mushafLocalStorePaths.DATA_PATH, store);
  await writeMeta({version: MUSHAF_DATA_VERSION, complete: true});
  await clearDir(mushafLocalStorePaths.TMP_DIR);

  report({
    phase: 'ready',
    pagesCompleted: MUSHAF_TOTAL_PAGES,
    totalPages: MUSHAF_TOTAL_PAGES,
  });

  return store;
};
