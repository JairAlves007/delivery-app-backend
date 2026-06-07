import type {
  NotificationDetail,
  NotificationFromRepository,
} from "@/types/notification.js";

export const mapNotification = (
  notification: NotificationFromRepository,
): NotificationDetail => ({
  id: notification.id,
  type: notification.type,
  title: notification.title,
  description: notification.description,
  link: notification.link,
  metadata: notification.metadata,
  seen: notification.userStates.some((state) => state.seen_at !== null),
  created_at: notification.created_at,
  expires_at: notification.expires_at,
});
