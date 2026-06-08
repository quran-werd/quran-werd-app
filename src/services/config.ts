/**
 * API configuration
 * Set API_BASE_URL and Google client IDs via .env (react-native-dotenv)
 */

import {Platform} from 'react-native';
import {
  API_BASE_URL as ENV_API_BASE_URL,
  GOOGLE_IOS_CLIENT_ID as ENV_GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID as ENV_GOOGLE_WEB_CLIENT_ID,
  DEV_NOTIFICATION_TIME as ENV_DEV_NOTIFICATION_TIME,
} from '@env';
import type {NotificationTime} from '../utils/storage/notification.storage';

const devApiFallback =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://192.168.1.169:3000';

export const API_BASE_URL =
  ENV_API_BASE_URL ||
  (__DEV__ ? devApiFallback : 'https://quran-werd-server.onrender.com');

export const GOOGLE_IOS_CLIENT_ID = ENV_GOOGLE_IOS_CLIENT_ID ?? '';
export const GOOGLE_WEB_CLIENT_ID = ENV_GOOGLE_WEB_CLIENT_ID ?? '';

export const DEV_NOTIFICATION_TIME = ENV_DEV_NOTIFICATION_TIME ?? '';

export const parseNotificationTime = (
  value: string,
): NotificationTime | null => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }
  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }
  return {hour, minute};
};

export const getDevNotificationTimeOverride = (): NotificationTime | null => {
  if (!__DEV__ || !DEV_NOTIFICATION_TIME) {
    return null;
  }
  return parseNotificationTime(DEV_NOTIFICATION_TIME);
};

export const QURAN_CDN_API_CONFIG = {
  BASE_URL: 'https://api.qurancdn.com/api/qdc',
};

export const QURAN_CDN_DEFAULT_VERSES_PARAMS = {
  words: true,
  perPage: 'all',
  wordFields: 'text_uthmani,code_v1,code_v2,page_number,line_number',
  mushafId: 2,
};
