/**
 * Runtime QCF font download + registry (src/services/qcfFonts).
 * expo-file-system and expo-font are replaced with an in-memory fake.
 */
const mockFiles = new Map<string, {size: number; head: string}>();
let mockDownloadImpl: (url: string) => {
  status: number;
  size: number;
  head?: string;
  length?: number;
};

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///docs/',
  EncodingType: {Base64: 'base64'},
  getInfoAsync: jest.fn(async (uri: string) => {
    if (uri.endsWith('/')) {
      return {exists: true, isDirectory: true};
    }
    const f = mockFiles.get(uri);
    return f
      ? {exists: true, isDirectory: false, size: f.size}
      : {exists: false};
  }),
  makeDirectoryAsync: jest.fn(async () => {}),
  readDirectoryAsync: jest.fn(async (dir: string) =>
    [...mockFiles.keys()]
      .filter(k => k.startsWith(dir))
      .map(k => k.slice(dir.length)),
  ),
  readAsStringAsync: jest.fn(
    async (uri: string) => mockFiles.get(uri)?.head ?? '',
  ),
  writeAsStringAsync: jest.fn(async (uri: string) => {
    mockFiles.set(uri, {size: 10, head: ''});
  }),
  deleteAsync: jest.fn(async (uri: string) => {
    mockFiles.delete(uri);
  }),
  moveAsync: jest.fn(async ({from, to}: {from: string; to: string}) => {
    const f = mockFiles.get(from);
    mockFiles.delete(from);
    if (f) {
      mockFiles.set(to, f);
    }
  }),
  downloadAsync: jest.fn(async (url: string, to: string) => {
    const r = mockDownloadImpl(url);
    mockFiles.set(to, {size: r.size, head: r.head ?? 'AAEAAAAP'});
    return {
      status: r.status,
      headers: {'Content-Length': String(r.length ?? r.size)},
      uri: to,
    };
  }),
}));

const mockLoaded = new Set<string>();
jest.mock('expo-font', () => ({
  isLoaded: jest.fn((name: string) => mockLoaded.has(name)),
  loadAsync: jest.fn(async (map: Record<string, string>) => {
    Object.keys(map).forEach(k => mockLoaded.add(k));
  }),
}));

import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';

type Store = typeof import('../src/services/qcfFonts/qcfFontStore');
let downloadAllPageFonts: Store['downloadAllPageFonts'];
let ensurePageFontLoaded: Store['ensurePageFontLoaded'];
let getQcfFontFamily: Store['getQcfFontFamily'];
let getQcfFontFileUri: Store['getQcfFontFileUri'];
let isPageFontLoaded: Store['isPageFontLoaded'];

const PRIMARY = 'https://verses.quran.foundation/fonts/quran/hafs/v1/ttf';

beforeEach(() => {
  mockFiles.clear();
  mockLoaded.clear();
  jest.clearAllMocks();
  // Fresh module state (in-memory registries) for every test.
  jest.isolateModules(() => {
    ({
      downloadAllPageFonts,
      ensurePageFontLoaded,
      getQcfFontFamily,
      getQcfFontFileUri,
      isPageFontLoaded,
    } = require('../src/services/qcfFonts/qcfFontStore'));
  });
  mockDownloadImpl = () => ({status: 200, size: 30000});
});

describe('qcfFontStore', () => {
  it('names fonts QCF_P### and caches them in documentDirectory', () => {
    expect(getQcfFontFamily(1)).toBe('QCF_P001');
    expect(getQcfFontFamily(604)).toBe('QCF_P604');
    expect(getQcfFontFileUri(7)).toBe('file:///docs/qcf-fonts/v1/p7.ttf');
  });

  it('downloads once and calls Font.loadAsync once per page', async () => {
    await Promise.all([ensurePageFontLoaded(3), ensurePageFontLoaded(3)]);
    await ensurePageFontLoaded(3);
    expect(FileSystem.downloadAsync).toHaveBeenCalledTimes(1);
    expect(FileSystem.downloadAsync).toHaveBeenCalledWith(
      `${PRIMARY}/p3.ttf`,
      'file:///docs/qcf-fonts/v1/p3.ttf.part',
    );
    expect(Font.loadAsync).toHaveBeenCalledTimes(1);
    expect(Font.loadAsync).toHaveBeenCalledWith({
      QCF_P003: 'file:///docs/qcf-fonts/v1/p3.ttf',
    });
    expect(isPageFontLoaded(3)).toBe(true);
  });

  it('skips the download when the font is already on disk', async () => {
    mockFiles.set(getQcfFontFileUri(10), {size: 30000, head: 'AAEAAA'});
    await ensurePageFontLoaded(10);
    expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
    expect(Font.loadAsync).toHaveBeenCalledTimes(1);
  });

  it('falls back to the second host when the primary fails', async () => {
    mockDownloadImpl = url =>
      url.startsWith(PRIMARY)
        ? {status: 503, size: 0}
        : {status: 200, size: 30000};
    await ensurePageFontLoaded(20);
    const urls = (FileSystem.downloadAsync as jest.Mock).mock.calls.map(
      c => c[0],
    );
    expect(urls[urls.length - 1]).toBe(
      'https://static.qurancdn.com/fonts/quran/hafs/v1/ttf/p20.ttf',
    );
    expect(mockFiles.has(getQcfFontFileUri(20))).toBe(true);
  });

  it('rejects truncated or non-TTF downloads and does not register them', async () => {
    mockDownloadImpl = () => ({status: 200, size: 30000, length: 40000});
    await expect(ensurePageFontLoaded(30)).rejects.toThrow(/page 30/);
    mockDownloadImpl = () => ({status: 200, size: 30000, head: 'PCFET0NUWVBF'});
    await expect(ensurePageFontLoaded(31)).rejects.toThrow(/TrueType/);
    expect(mockFiles.has(getQcfFontFileUri(30))).toBe(false);
    expect(Font.loadAsync).not.toHaveBeenCalled();
    // A later retry with a good response succeeds.
    mockDownloadImpl = () => ({status: 200, size: 30000});
    await ensurePageFontLoaded(30);
    expect(isPageFontLoaded(30)).toBe(true);
  });

  it('bulk download resumes, reports progress and writes a completion marker', async () => {
    for (let p = 1; p <= 600; p++) {
      mockFiles.set(getQcfFontFileUri(p), {size: 30000, head: 'AAEAAA'});
    }
    const progress: number[] = [];
    await downloadAllPageFonts(pr => progress.push(pr.fontsCompleted));
    expect(FileSystem.downloadAsync).toHaveBeenCalledTimes(4);
    expect(progress[0]).toBe(600);
    expect(progress[progress.length - 1]).toBe(604);
    expect(mockFiles.has('file:///docs/qcf-fonts/v1/complete.json')).toBe(true);

    (FileSystem.downloadAsync as jest.Mock).mockClear();
    await downloadAllPageFonts();
    expect(FileSystem.downloadAsync).not.toHaveBeenCalled();
  });

  it('bulk download stops early and throws when offline', async () => {
    mockDownloadImpl = () => {
      throw new Error('offline');
    };
    await expect(downloadAllPageFonts()).rejects.toThrow(/offline/);
    expect(
      (FileSystem.downloadAsync as jest.Mock).mock.calls.length,
    ).toBeLessThan(100);
  });
});
