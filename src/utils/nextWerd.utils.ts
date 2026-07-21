import type {Werd} from '../services/revisionPlan.service';
import type {NotificationTime} from './storage/notification.storage';

export const formatNotificationTime = (time: NotificationTime): string => {
  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');
  return `${hour}:${minute}`;
};

export const getNextWerdInPlan = (
  awrad: Werd[],
  currentWerd: Werd | null,
): Werd | null => {
  if (!awrad.length) {
    return null;
  }

  if (!currentWerd) {
    const sorted = [...awrad].sort((a, b) => a.order - b.order);
    return sorted[0] ?? null;
  }

  const maxOrder = Math.max(...awrad.map(w => w.order));
  const nextOrder = currentWerd.order >= maxOrder ? 1 : currentWerd.order + 1;
  return awrad.find(w => w.order === nextOrder) ?? null;
};
