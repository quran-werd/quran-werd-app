import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATION_TIME_KEY = '@quran_werd_notification_time';

export type NotificationTime = {
  hour: number;
  minute: number;
};

export const DEFAULT_NOTIFICATION_TIME: NotificationTime = {
  hour: 8,
  minute: 0,
};

export const loadNotificationTime = async (): Promise<NotificationTime> => {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATION_TIME_KEY);
    if (!raw) {
      return DEFAULT_NOTIFICATION_TIME;
    }
    const parsed = JSON.parse(raw) as NotificationTime;
    if (
      typeof parsed.hour === 'number' &&
      typeof parsed.minute === 'number' &&
      parsed.hour >= 0 &&
      parsed.hour <= 23 &&
      parsed.minute >= 0 &&
      parsed.minute <= 59
    ) {
      return parsed;
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_NOTIFICATION_TIME;
};

export const saveNotificationTime = async (
  time: NotificationTime,
): Promise<void> => {
  await AsyncStorage.setItem(NOTIFICATION_TIME_KEY, JSON.stringify(time));
};
