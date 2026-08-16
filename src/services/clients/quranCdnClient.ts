/**
 * API Client for Quran CDN API
 * Uses axios for HTTP requests
 * Matches quran.com-frontend-next architecture
 */

import axios, {AxiosInstance, AxiosError} from 'axios';
import {QURAN_CDN_API_CONFIG, QURAN_CDN_DEFAULT_VERSES_PARAMS} from '../config';
import {getVerseTextFromWords} from '../../components/QuranPager/utils/verseSelection.utils';
import {transformApiWord} from '../transformers';
import {ApiChaptersResponse} from '../../types/api-response.types';

/**
 * Create axios instance with default configuration for Quran CDN
 */
const quranCdnClient: AxiosInstance = axios.create({
  baseURL: QURAN_CDN_API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for converting camelCase to snake_case
 */
quranCdnClient.interceptors.request.use(config => {
  if (config.params) {
    const snakeCaseParams: Record<string, any> = {};
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Convert camelCase to snake_case
        const snakeKey = key.replace(
          /[A-Z]/g,
          letter => `_${letter.toLowerCase()}`,
        );
        snakeCaseParams[snakeKey] = value;
      }
    });
    config.params = snakeCaseParams;
  }
  return config;
});

/**
 * Response interceptor for error handling
 */
quranCdnClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error(
        'Quran CDN API Error:',
        error.response.status,
        error.response.data,
      );
    } else if (error.request) {
      // Request made but no response received
      console.error('Quran CDN Network Error:', error.message);
    } else {
      // Error in request configuration
      console.error('Quran CDN Request Error:', error.message);
    }
    return Promise.reject(error);
  },
);

/**
 * Makes a URL for Quran CDN API requests
 */
export const makeQuranCdnUrl = (
  path: string,
  params?: Record<string, any>,
): string => {
  const baseUrl = `${QURAN_CDN_API_CONFIG.BASE_URL}${path}`;

  if (!params) {
    return baseUrl;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        letter => `_${letter.toLowerCase()}`,
      );
      searchParams.append(snakeKey, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Makes a URL for fetching page verses from Quran CDN
 */
export const makePageVersesUrl = (
  pageNumber: number,
  params?: Record<string, any>,
): string => {
  const finalParams = {
    ...QURAN_CDN_DEFAULT_VERSES_PARAMS,
    ...params,
  };

  return makeQuranCdnUrl(`/verses/by_page/${pageNumber}`, finalParams);
};

/**
 * Generic fetcher function using axios for Quran CDN
 */
export const quranCdnFetcher = async <T>(url: string): Promise<T> => {
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Quran CDN API Error: ${error.response?.status || 'Unknown'} ${
          error.response?.statusText || error.message
        }`,
      );
    }
    throw error;
  }
};

/**
 * Fetches verses for a specific page using Quran CDN API
 */
export const fetchPageVerses = async (pageNumber: number) => {
  const path = `/verses/by_page/${pageNumber}`;
  const params = {
    ...QURAN_CDN_DEFAULT_VERSES_PARAMS,
  };

  const response = await quranCdnClient.get(path, {params});
  return response.data;
};

/**
 * Fetches the surah/chapter list (Arabic name, ayah count, page range) for
 * mushaf locator data. See ApiChapter.
 */
export const fetchChapters = async () => {
  const response = await quranCdnClient.get<ApiChaptersResponse>('/chapters', {
    params: {language: 'ar'},
  });
  return response.data.chapters;
};

export const fetchAyahByKey = async (
  chapterNumber: number,
  verseNumber: number,
) => {
  const ayahKey = `${chapterNumber}:${verseNumber}`;

  const path = `/verses/by_key/${ayahKey}`;
  const params = {
    ...QURAN_CDN_DEFAULT_VERSES_PARAMS,
  };

  const response = await quranCdnClient.get(path, {params});
  const words = response.data.verse.words.map((apiWord: any) =>
    transformApiWord(apiWord, ayahKey),
  );
  const verseText = getVerseTextFromWords(words);
  return verseText;
};

export {quranCdnClient};
