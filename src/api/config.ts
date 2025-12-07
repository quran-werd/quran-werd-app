/**
 * API Configuration for Quran.com API
 * Matches the configuration from quran.com-frontend-next
 */

export const QURAN_CDN_API_CONFIG = {
  PRODUCTION_HOST: 'https://api.qurancdn.com',
  STAGING_HOST: 'https://staging.quran.com',
  API_ROOT_PATH: '/api/qdc',

  // Use production by default
  get BASE_URL() {
    return `${this.PRODUCTION_HOST}${this.API_ROOT_PATH}`;
  },
};

export const QURAN_CDN_DEFAULT_VERSES_PARAMS = {
  words: true,
  perPage: 'all',
  // Use default font settings
  wordFields: 'text_uthmani,code_v1,code_v2,page_number,line_number',
  mushafId: 2, // QCF Mushaf
};

export const WERD_API_CONFIG = {
  PRODUCTION_HOST: 'https://quran-werd-server.onrender.com',
  STAGING_HOST: 'https://quran-werd-server.onrender.com',
  LOCAL_HOST: 'http://10.0.2.2:3000', // Android emulator localhost
  API_ROOT_PATH: '',

  // Use __DEV__ to automatically switch to localhost in development
  // For Android emulator, use 10.0.2.2 instead of localhost
  get BASE_URL() {
    // Uncomment the line below to use localhost in development
    return __DEV__
      ? `${this.LOCAL_HOST}${this.API_ROOT_PATH}`
      : `${this.STAGING_HOST}${this.API_ROOT_PATH}`;
  },
};
