import { makeNotificationRepository } from "@/factories/repositories/make-notification-repository.js";
import { UnseenCountService } from "@/services/notification/unseen-count-service.js";

export const makeUnseenCountService = () => {
  const notificationRepository = makeNotificationRepository();

  return new UnseenCountService(notificationRepository);
};
