import type { Notification, Prisma } from "@/generated/prisma/client.js";
import type {
  ListNotificationsParams,
  NotificationFromRepository,
  NotificationStateParams,
  NotificationUserScope,
} from "@/types/notification.js";

export interface INotificationRepository {
  create(data: Prisma.NotificationCreateInput): Promise<Notification>;
  listForUser(
    params: ListNotificationsParams,
  ): Promise<NotificationFromRepository[]>;
  countUnseen(params: NotificationUserScope): Promise<number>;
  findById(params: NotificationStateParams): Promise<Notification | null>;
  markSeen(params: NotificationStateParams): Promise<void>;
  markAllSeen(params: NotificationUserScope): Promise<void>;
  dismiss(params: NotificationStateParams): Promise<void>;
  deleteExpired(): Promise<number>;
}
