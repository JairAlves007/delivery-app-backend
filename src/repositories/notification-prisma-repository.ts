import type { Notification, Prisma } from "@/generated/prisma/client.js";
import type { INotificationRepository } from "@/interfaces/repositories/notification-repository.js";
import prisma from "@/lib/prisma.js";
import type {
  ListNotificationsParams,
  NotificationFromRepository,
  NotificationStateParams,
  NotificationUserScope,
} from "@/types/notification.js";

export class NotificationPrismaRepository implements INotificationRepository {
  async create(data: Prisma.NotificationCreateInput): Promise<Notification> {
    return await prisma.notification.create({ data });
  }

  async listForUser({
    establishmentId,
    userId,
    limit,
    cursor,
  }: ListNotificationsParams): Promise<NotificationFromRepository[]> {
    return await prisma.notification.findMany({
      where: {
        establishment_id: establishmentId,
        expires_at: { gt: new Date() },
        userStates: {
          none: {
            user_id: userId,
            dismissed_at: { not: null },
          },
        },
      },
      include: {
        userStates: {
          where: { user_id: userId },
        },
      },
      orderBy: { id: "desc" },
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });
  }

  async countUnseen({
    establishmentId,
    userId,
  }: NotificationUserScope): Promise<number> {
    return await prisma.notification.count({
      where: {
        establishment_id: establishmentId,
        expires_at: { gt: new Date() },
        userStates: {
          none: {
            user_id: userId,
            OR: [{ seen_at: { not: null } }, { dismissed_at: { not: null } }],
          },
        },
      },
    });
  }

  async findById(notificationId: string): Promise<Notification | null> {
    return await prisma.notification.findUnique({
      where: { id: notificationId },
    });
  }

  async markSeen({
    notificationId,
    userId,
  }: NotificationStateParams): Promise<void> {
    await prisma.notificationUserState.upsert({
      where: {
        uq_notification_user: {
          notification_id: notificationId,
          user_id: userId,
        },
      },
      create: {
        notification_id: notificationId,
        user_id: userId,
        seen_at: new Date(),
      },
      update: { seen_at: new Date() },
    });
  }

  async markAllSeen({
    establishmentId,
    userId,
  }: NotificationUserScope): Promise<void> {
    const unseen = await prisma.notification.findMany({
      where: {
        establishment_id: establishmentId,
        expires_at: { gt: new Date() },
        userStates: { none: { user_id: userId, seen_at: { not: null } } },
      },
      select: { id: true },
    });

    if (unseen.length === 0) return;

    const now = new Date();

    await prisma.$transaction(
      unseen.map(({ id }) =>
        prisma.notificationUserState.upsert({
          where: {
            uq_notification_user: { notification_id: id, user_id: userId },
          },
          create: { notification_id: id, user_id: userId, seen_at: now },
          update: { seen_at: now },
        }),
      ),
    );
  }

  async dismiss({
    notificationId,
    userId,
  }: NotificationStateParams): Promise<void> {
    const now = new Date();

    await prisma.notificationUserState.upsert({
      where: {
        uq_notification_user: {
          notification_id: notificationId,
          user_id: userId,
        },
      },
      create: {
        notification_id: notificationId,
        user_id: userId,
        seen_at: now,
        dismissed_at: now,
      },
      update: { dismissed_at: now },
    });
  }

  async deleteExpired(): Promise<number> {
    const { count } = await prisma.notification.deleteMany({
      where: { expires_at: { lt: new Date() } },
    });

    return count;
  }
}
