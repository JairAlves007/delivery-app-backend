import { NotificationPrismaRepository } from "@/repositories/notification-prisma-repository.js";

export const makeNotificationRepository = () => {
  return new NotificationPrismaRepository();
};
