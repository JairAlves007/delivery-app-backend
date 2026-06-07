import type { INotificationRepository } from "@/interfaces/repositories/notification-repository.js";
import { mapNotification } from "@/services/notification/map-notification.js";
import type { CursorPaginatedResponse } from "@/types/crud.js";
import type {
  ListNotificationsParams,
  NotificationDetail,
} from "@/types/notification.js";

type ListNotificationsServiceResponse =
  CursorPaginatedResponse<NotificationDetail>;

export class ListNotificationsService {
  private notificationRepository: INotificationRepository;

  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  async handle({
    establishmentId,
    userId,
    limit,
    cursor,
  }: ListNotificationsParams): Promise<ListNotificationsServiceResponse> {
    const rows = await this.notificationRepository.listForUser({
      establishmentId,
      userId,
      limit,
      cursor,
    });

    const hasNextPage = rows.length > limit;
    const items = hasNextPage ? rows.slice(0, limit) : rows;
    const nextCursor = hasNextPage ? (items.at(-1)?.id ?? null) : null;

    return {
      items: items.map(mapNotification),
      pagination: { nextCursor, hasNextPage },
    };
  }
}
