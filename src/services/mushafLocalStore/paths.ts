import * as FileSystem from 'expo-file-system';

const ROOT_DIR = `${FileSystem.documentDirectory}mushaf-local-store/`;
const TMP_DIR = `${ROOT_DIR}tmp/`;
const META_PATH = `${ROOT_DIR}meta.json`;
const DATA_PATH = `${ROOT_DIR}data.json`;

export const mushafLocalStorePaths = {
  ROOT_DIR,
  TMP_DIR,
  META_PATH,
  DATA_PATH,
};

export const tempPagePath = (pageNumber: number): string =>
  `${TMP_DIR}page-${pageNumber}.json`;

const TEMP_PAGE_FILENAME_PATTERN = /^page-(\d+)\.json$/;

export const ensureDirExists = async (dirUri: string): Promise<void> => {
  const info = await FileSystem.getInfoAsync(dirUri);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dirUri, {intermediates: true});
  }
};

export const clearDir = async (dirUri: string): Promise<void> => {
  const info = await FileSystem.getInfoAsync(dirUri);
  if (info.exists) {
    await FileSystem.deleteAsync(dirUri, {idempotent: true});
  }
};

/**
 * Writes JSON to disk via a `.part` sibling file plus a move, so a process
 * kill mid-write never leaves a truncated file that a resume would mistake
 * for a completed page.
 */
export const writeJsonAtomic = async (uri: string, data: unknown): Promise<void> => {
  const partUri = `${uri}.part`;
  await FileSystem.writeAsStringAsync(partUri, JSON.stringify(data));
  await FileSystem.deleteAsync(uri, {idempotent: true});
  await FileSystem.moveAsync({from: partUri, to: uri});
};

export const readJson = async <T>(uri: string): Promise<T> => {
  const raw = await FileSystem.readAsStringAsync(uri);
  return JSON.parse(raw) as T;
};

/** Page numbers that already have a completed temp file on disk (for resume). */
export const listCompletedTempPageNumbers = async (): Promise<Set<number>> => {
  const info = await FileSystem.getInfoAsync(mushafLocalStorePaths.TMP_DIR);
  if (!info.exists) {
    return new Set();
  }

  const entries = await FileSystem.readDirectoryAsync(mushafLocalStorePaths.TMP_DIR);
  const pageNumbers = new Set<number>();

  for (const entry of entries) {
    const match = entry.match(TEMP_PAGE_FILENAME_PATTERN);
    if (match) {
      pageNumbers.add(parseInt(match[1], 10));
    }
  }

  return pageNumbers;
};
