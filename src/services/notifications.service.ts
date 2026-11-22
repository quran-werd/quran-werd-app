import notifee, {
  AndroidImportance,
  Event,
  EventType,
  Notification,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import i18n from '../i18n';
import {navigationRef} from '../navigation/navigationRef';
import {store} from '../store';
import {fetchCurrentWerd} from '../features/RevisionSession/revisionSessionAction';
import {selectIsAuthenticated} from '../features/Auth/authSlice';
import {getDevNotificationTimeOverride} from './config';
import {
  loadNotificationTime,
  saveNotificationTime,
  type NotificationTime,
} from '../utils/storage/notification.storage';

const CHANNEL_ID = 'daily-werd';
const NOTIFICATION_ID = 'daily-werd';

const buildNotificationContent = () => ({
  title: i18n.t('notifications.dailyTitle'),
  body: i18n.t('notifications.dailyBody'),
  android: {
    channelId: CHANNEL_ID,
    pressAction: {id: 'default', launchActivity: 'default'},
  },
  data: {screen: 'Revision'},
});

export const requestNotificationPermission = async () => {
  await notifee.requestPermission();
};

export const setupNotificationChannel = async () => {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Daily Werd',
    importance: AndroidImportance.HIGH,
  });
};

const navigateWhenReady = () => {
  const attempt = () => {
    if (navigationRef.isReady()) {
      navigationRef.navigate('Revision', {});
    } else {
      setTimeout(attempt, 100);
    }
  };
  attempt();
};

export const handleNotificationPress = async (notification?: Notification) => {
  if (notification?.data?.screen !== 'Revision') {
    return;
  }

  const isAuthenticated = selectIsAuthenticated(store.getState());
  if (!isAuthenticated) {
    return;
  }

  try {
    await store.dispatch(fetchCurrentWerd()).unwrap();
  } catch {
    // navigation still attempted; RevisionScreen will retry fetch
  }

  navigateWhenReady();
};

export const handleNotificationEvent = async ({type, detail}: Event) => {
  if (type === EventType.PRESS) {
    await handleNotificationPress(detail.notification);
  }
};

export const getEffectiveNotificationTime =
  async (): Promise<NotificationTime> => {
    const devOverride = getDevNotificationTimeOverride();
    if (devOverride) {
      return devOverride;
    }
    return loadNotificationTime();
  };

const buildTriggerDate = (time: NotificationTime): Date => {
  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(time.hour, time.minute, 0, 0);
  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }
  return triggerDate;
};

export const scheduleDailyWerdNotification = async (
  time?: NotificationTime,
) => {
  const resolvedTime = time ?? (await getEffectiveNotificationTime());

  await requestNotificationPermission();
  await setupNotificationChannel();
  await notifee.cancelTriggerNotification(NOTIFICATION_ID);

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: buildTriggerDate(resolvedTime).getTime(),
    repeatFrequency: 1,
  };

  await notifee.createTriggerNotification(
    {
      id: NOTIFICATION_ID,
      ...buildNotificationContent(),
    },
    trigger,
  );
};

export const rescheduleDailyWerdNotification = async (
  time: NotificationTime,
) => {
  await saveNotificationTime(time);
  await scheduleDailyWerdNotification(time);
};

export const cancelDailyNotifications = async () => {
  await notifee.cancelAllNotifications();
};
