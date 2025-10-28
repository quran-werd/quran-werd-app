/**
 * API Configuration for Quran.com API
 * Matches the configuration from quran.com-frontend-next
 */

export const API_CONFIG = {
  PRODUCTION_HOST: 'https://api.qurancdn.com',
  STAGING_HOST: 'https://staging.quran.com',
  API_ROOT_PATH: '/api/qdc',

  // Use production by default
  get BASE_URL() {
    return `${this.PRODUCTION_HOST}${this.API_ROOT_PATH}`;
  },
};

export const DEFAULT_VERSES_PARAMS = {
  words: true,
  perPage: 'all',
  // Use default font settings
  wordFields: 'text_uthmani,code_v1,code_v2,page_number,line_number',
  mushafId: 2, // QCF Mushaf
};
