import type { INotificationRepository } from "@/interfaces/repositories/notification-repository.js";
import type { NotificationUserScope } from "@/types/notification.js";

type UnseenCountServiceResponse = {
  count: number;
};

export class UnseenCountService {
  private notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async handle(
    params: NotificationUserScope,
  ): Promise<UnseenCountServiceResponse> {
    const count = await this.notificationRepository.countUnseen(params);

    return { count };
  }
}
