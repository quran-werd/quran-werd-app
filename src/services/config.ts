/**
 * API configuration
 * Set API_BASE_URL via react-native-config (.env) or fallback for dev
 */

let Config: {API_BASE_URL?: string} = {};
try {
  Config = require('react-native-config').default;
} catch {
  Config = {};
}

export const API_BASE_URL =
  Config.API_BASE_URL ||
  (__DEV__ ? 'http://10.0.2.2:3000' : 'https://quran-werd-server.onrender.com');

export const QURAN_CDN_API_CONFIG = {
  BASE_URL: 'https://api.qurancdn.com/api/qdc',
};

export const QURAN_CDN_DEFAULT_VERSES_PARAMS = {
  words: true,
  perPage: 'all',
  wordFields: 'text_uthmani,code_v1,code_v2,page_number,line_number',
  mushafId: 2,
};
