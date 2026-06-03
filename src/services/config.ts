/**
 * API configuration
 * Set API_BASE_URL via react-native-config (.env) or fallback for dev
 */

import {Platform} from 'react-native';

let Config: {
  API_BASE_URL?: string;
  GOOGLE_IOS_CLIENT_ID?: string;
  GOOGLE_WEB_CLIENT_ID?: string;
} = {};
try {
  Config = require('react-native-config').default;
} catch {
  Config = {};
}

const devApiFallback =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://192.168.1.169:3000';

export const API_BASE_URL =
  Config.API_BASE_URL ||
  (__DEV__ ? devApiFallback : 'https://quran-werd-server.onrender.com');

export const GOOGLE_IOS_CLIENT_ID = Config.GOOGLE_IOS_CLIENT_ID ?? '';
export const GOOGLE_WEB_CLIENT_ID = Config.GOOGLE_WEB_CLIENT_ID ?? '';

export const QURAN_CDN_API_CONFIG = {
  BASE_URL: 'https://api.qurancdn.com/api/qdc',
};

export const QURAN_CDN_DEFAULT_VERSES_PARAMS = {
  words: true,
  perPage: 'all',
  wordFields: 'text_uthmani,code_v1,code_v2,page_number,line_number',
  mushafId: 2,
};
