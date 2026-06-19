import { NotificationNotFound } from "@/errors/notification/not-found.js";
import type { INotificationRepository } from "@/interfaces/repositories/notification-repository.js";
import type { NotificationStateParams } from "@/types/notification.js";

export class MarkNotificationSeenService {
  private notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async handle({
    notificationId,
    establishmentId,
    userId,
  }: NotificationStateParams): Promise<void> {
    const notification = await this.notificationRepository.findById({
      notificationId,
      establishmentId,
      userId,
    });

    if (!notification) throw new NotificationNotFound();

    await this.notificationRepository.markSeen({
      notificationId,
      establishmentId,
      userId,
    });
  }
}
