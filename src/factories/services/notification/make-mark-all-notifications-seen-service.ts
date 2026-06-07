import { makeNotificationRepository } from "@/factories/repositories/make-notification-repository.js";
import { MarkAllNotificationsSeenService } from "@/services/notification/mark-all-notifications-seen-service.js";

export const makeMarkAllNotificationsSeenService = () => {
  const notificationRepository = makeNotificationRepository();

  return new MarkAllNotificationsSeenService(notificationRepository);
};
