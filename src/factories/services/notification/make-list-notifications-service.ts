import { makeNotificationRepository } from "@/factories/repositories/make-notification-repository.js";
import { ListNotificationsService } from "@/services/notification/list-notifications-service.js";

export const makeListNotificationsService = () => {
  const notificationRepository = makeNotificationRepository();

  return new ListNotificationsService(notificationRepository);
};
