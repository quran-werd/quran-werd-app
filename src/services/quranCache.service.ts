import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchPageVerses} from './clients/quranCdnClient';

const CACHE_PREFIX = '@quran_cache_page_';

export const getCachedPage = async (pageNumber: number) => {
  try {
    const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${pageNumber}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const cachePage = async (pageNumber: number, data: unknown) => {
  try {
    await AsyncStorage.setItem(
      `${CACHE_PREFIX}${pageNumber}`,
      JSON.stringify(data),
    );
  } catch {
    // ignore cache write failures
  }
};

export const fetchPageWithCache = async (pageNumber: number) => {
  const cached = await getCachedPage(pageNumber);
  if (cached) {
    return cached;
  }

  const data = await fetchPageVerses(pageNumber);
  await cachePage(pageNumber, data);
  return data;
};
