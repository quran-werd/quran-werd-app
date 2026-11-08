import type {NotificationTime} from './storage/notification.storage';

export const formatNotificationTime = (time: NotificationTime): string => {
  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');
  return `${hour}:${minute}`;
};
