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

  async findById({
    notificationId,
    establishmentId,
  }: NotificationStateParams): Promise<Notification | null> {
    return await prisma.notification.findFirst({
      where: { id: notificationId, establishment_id: establishmentId },
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
    const notificationIds = unseen.map(({ id }) => id);

    await prisma.$transaction([
      prisma.notificationUserState.updateMany({
        where: {
          user_id: userId,
          notification_id: { in: notificationIds },
          seen_at: null,
        },
        data: { seen_at: now },
      }),
      prisma.notificationUserState.createMany({
        data: notificationIds.map((notificationId) => ({
          notification_id: notificationId,
          user_id: userId,
          seen_at: now,
        })),
        skipDuplicates: true,
      }),
    ]);
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
