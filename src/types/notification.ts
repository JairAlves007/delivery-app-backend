import type {
  NotificationType,
  Prisma,
} from "@/generated/prisma/client.js";

import type { CursorPaginationParams } from "./crud.js";
import type { UserID } from "./user.js";

export type CreateNotificationJob = {
  establishmentId: string;
  type: NotificationType;
  title: string;
  description: string;
  scheduledAt?: string | null;
  metadata?: Prisma.InputJsonValue;
};

export type NotificationDetail = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  link: string | null;
  metadata: Prisma.JsonValue | null;
  seen: boolean;
  created_at: Date;
  expires_at: Date;
};

export type NotificationSsePayload = Omit<
  NotificationDetail,
  "created_at" | "expires_at"
> & {
  created_at: string;
  expires_at: string;
};

export type NotificationFromRepository = Prisma.NotificationGetPayload<{
  include: { userStates: true };
}>;

export type NotificationUserScope = {
  establishmentId: string;
  userId: UserID;
};

export type ListNotificationsParams = NotificationUserScope &
  Pick<CursorPaginationParams<string>, "limit" | "cursor">;

export type NotificationStateParams = NotificationUserScope & {
  notificationId: string;
};
