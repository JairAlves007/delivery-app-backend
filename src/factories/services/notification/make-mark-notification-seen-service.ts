import { makeNotificationRepository } from "@/factories/repositories/make-notification-repository.js";
import { MarkNotificationSeenService } from "@/services/notification/mark-notification-seen-service.js";

export const makeMarkNotificationSeenService = () => {
  const notificationRepository = makeNotificationRepository();

  return new MarkNotificationSeenService(notificationRepository);
};
