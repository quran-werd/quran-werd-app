/**
 * API Module
 * Provides integration with Quran.com API and Werd Server API
 * Matches quran.com-frontend-next API structure
 */

export * from './config';
export * from './clients';
export * from './transformers';

// Re-export for backward compatibility
export {
  quranCdnClient as apiClient,
  makeQuranCdnUrl as makeUrl,
  quranCdnFetcher as fetcher,
  fetchPageVerses,
  makePageVersesUrl,
} from './clients/quranCdnClient';
