import { makeNotificationRepository } from "@/factories/repositories/make-notification-repository.js";
import { DismissNotificationService } from "@/services/notification/dismiss-notification-service.js";

export const makeDismissNotificationService = () => {
  const notificationRepository = makeNotificationRepository();

  return new DismissNotificationService(notificationRepository);
};
