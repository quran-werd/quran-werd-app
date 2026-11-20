import {useCallback, useEffect, useState} from 'react';
import {Platform} from 'react-native';
import type {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {
  getDevNotificationTimeOverride,
  DEV_NOTIFICATION_TIME,
} from '../../../services/config';
import {
  rescheduleDailyWerdNotification,
  cancelDailyNotifications,
} from '../../../services/notifications.service';
import {
  loadNotificationTime,
  type NotificationTime,
} from '../../../utils/storage/notification.storage';

const timeToDate = (time: NotificationTime): Date => {
  const date = new Date();
  date.setHours(time.hour, time.minute, 0, 0);
  return date;
};

const dateToTime = (date: Date): NotificationTime => ({
  hour: date.getHours(),
  minute: date.getMinutes(),
});

const formatTime = (time: NotificationTime): string => {
  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');
  return `${hour}:${minute}`;
};

export function useNotificationSettings() {
  const [pickerDate, setPickerDate] = useState(() =>
    timeToDate({hour: 7, minute: 0}),
  );
  const [showPicker, setShowPicker] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const devOverride = getDevNotificationTimeOverride();

  const loadSettings = useCallback(async () => {
    const time = await loadNotificationTime();
    setPickerDate(timeToDate(time));
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleTimeChange = async (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'set' && date) {
      setPickerDate(date);
      try {
        await rescheduleDailyWerdNotification(dateToTime(date));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      if (value) {
        await rescheduleDailyWerdNotification(dateToTime(pickerDate));
      } else {
        await cancelDailyNotifications();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const togglePicker = () => setShowPicker(prev => !prev);

  return {
    pickerDate,
    formattedTime: formatTime(dateToTime(pickerDate)),
    showPicker,
    togglePicker,
    notificationsEnabled,
    handleToggleNotifications,
    handleTimeChange,
    devOverride,
    devTime: DEV_NOTIFICATION_TIME,
  };
}
