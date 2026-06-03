import notifee, {
  AndroidImportance,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import i18n from '../i18n';

const CHANNEL_ID = 'daily-werd';
const NOTIFICATION_HOUR = 8;
const NOTIFICATION_MINUTE = 0;

export const setupNotificationChannel = async () => {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Daily Werd',
    importance: AndroidImportance.HIGH,
  });
};

export const scheduleDailyWerdNotification = async () => {
  await setupNotificationChannel();

  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(NOTIFICATION_HOUR, NOTIFICATION_MINUTE, 0, 0);
  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(),
    repeatFrequency: 1,
  };

  await notifee.createTriggerNotification(
    {
      title: i18n.t('notifications.dailyTitle'),
      body: i18n.t('notifications.dailyBody'),
      android: {
        channelId: CHANNEL_ID,
        pressAction: {id: 'default', launchActivity: 'default'},
      },
      data: {screen: 'Revision'},
    },
    trigger,
  );
};

export const cancelDailyNotifications = async () => {
  await notifee.cancelAllNotifications();
};
