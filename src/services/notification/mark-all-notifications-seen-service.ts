import type { INotificationRepository } from "@/interfaces/repositories/notification-repository.js";
import type { NotificationUserScope } from "@/types/notification.js";

export class MarkAllNotificationsSeenService {
  private notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async handle(params: NotificationUserScope): Promise<void> {
    await this.notificationRepository.markAllSeen(params);
  }
}
