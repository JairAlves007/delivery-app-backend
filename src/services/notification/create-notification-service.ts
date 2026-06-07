import Constants from "@/helpers/constants.js";
import type { INotificationRepository } from "@/interfaces/repositories/notification-repository.js";
import {
  buildNotificationChannel,
  notificationPublisher,
} from "@/lib/redis-pubsub.js";
import { mapNotification } from "@/services/notification/map-notification.js";
import type { ResolveNotificationLinkService } from "@/services/notification/resolve-notification-link.js";
import type {
  CreateNotificationJob,
  NotificationSsePayload,
} from "@/types/notification.js";

export class CreateNotificationService {
  private notificationRepository: INotificationRepository;
  private resolveNotificationLinkService: ResolveNotificationLinkService;

  constructor(
    notificationRepository: INotificationRepository,
    resolveNotificationLinkService: ResolveNotificationLinkService,
  ) {
    this.notificationRepository = notificationRepository;
    this.resolveNotificationLinkService = resolveNotificationLinkService;
  }

  async handle({
    establishmentId,
    type,
    title,
    description,
    metadata,
  }: CreateNotificationJob): Promise<void> {
    const { expiresInDays } = Constants.NOTIFICATION_DEFAULTS[type];

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const link = await this.resolveNotificationLinkService.handle({
      type,
      metadata,
    });

    const notification = await this.notificationRepository.create({
      type,
      title,
      description,
      link,
      metadata,
      expires_at: expiresAt,
      establishment: { connect: { id: establishmentId } },
    });

    const detail = mapNotification({ ...notification, userStates: [] });

    const payload: NotificationSsePayload = {
      ...detail,
      created_at: detail.created_at.toISOString(),
      expires_at: detail.expires_at.toISOString(),
    };

    await notificationPublisher.publish(
      buildNotificationChannel(establishmentId),
      JSON.stringify(payload),
    );
  }
}
