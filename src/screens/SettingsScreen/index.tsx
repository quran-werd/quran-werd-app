import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import Typography from '../../components/shared/Typography';
import Button from '../../components/shared/Button';
import {colors} from '../../styles/colors';
import {
  getDevNotificationTimeOverride,
  DEV_NOTIFICATION_TIME,
} from '../../services/config';
import {rescheduleDailyWerdNotification} from '../../services/notifications.service';
import {
  loadNotificationTime,
  type NotificationTime,
} from '../../utils/storage/notification.storage';

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

export default function SettingsScreen() {
  const {t} = useTranslation();
  const [pickerDate, setPickerDate] = useState(() =>
    timeToDate({hour: 8, minute: 0}),
  );
  const [savedTime, setSavedTime] = useState<NotificationTime | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const devOverride = getDevNotificationTimeOverride();

  const loadSettings = useCallback(async () => {
    const time = await loadNotificationTime();
    setSavedTime(time);
    setPickerDate(timeToDate(time));
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleTimeChange = (_event: unknown, date?: Date) => {
    if (date) {
      setPickerDate(date);
      setSaved(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const time = dateToTime(pickerDate);
      await rescheduleDailyWerdNotification(time);
      setSavedTime(time);
      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h1">{t('settings.title')}</Typography>
        <Typography variant="body" color="secondary">
          {t('settings.subtitle')}
        </Typography>

        <Typography variant="caption">
          {t('settings.notificationTime')}
        </Typography>

        {savedTime ? (
          <Typography variant="body">{formatTime(savedTime)}</Typography>
        ) : null}

        <DateTimePicker
          value={pickerDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          style={styles.picker}
        />

        {__DEV__ && devOverride ? (
          <Typography variant="caption" color="secondary">
            {t('settings.devOverride', {time: DEV_NOTIFICATION_TIME})}
          </Typography>
        ) : null}

        <Button
          title={t('settings.save')}
          onPress={handleSave}
          loading={loading}
          fullWidth
        />

        {saved ? (
          <Typography variant="caption" color="secondary" align="center">
            {t('settings.saved')}
          </Typography>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    gap: 12,
  },
  picker: {
    alignSelf: 'stretch',
  },
});
