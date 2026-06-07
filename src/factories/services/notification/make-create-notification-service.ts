import { makeMenuRepository } from "@/factories/repositories/make-menu-repository.js";
import { makeNotificationRepository } from "@/factories/repositories/make-notification-repository.js";
import { CreateNotificationService } from "@/services/notification/create-notification-service.js";
import { ResolveNotificationLinkService } from "@/services/notification/resolve-notification-link.js";

export const makeCreateNotificationService = () => {
  const notificationRepository = makeNotificationRepository();
  const resolveNotificationLinkService = new ResolveNotificationLinkService(
    makeMenuRepository(),
  );

  return new CreateNotificationService(
    notificationRepository,
    resolveNotificationLinkService,
  );
};
