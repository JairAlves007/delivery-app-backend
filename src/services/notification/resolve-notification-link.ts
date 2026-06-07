import { makeCache } from "@/factories/services/cache/make-cache.js";
import {
  MenuAudienceType,
  NotificationType,
  type Prisma,
  ViewType,
} from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.js";

const NOTIFICATION_VIEW_TYPES: Record<NotificationType, ViewType> = {
  [NotificationType.ORDER_CREATED]: ViewType.VIEW_ORDERS,
};

type ResolveNotificationLinkParams = {
  type: NotificationType;
  metadata?: Prisma.InputJsonValue;
};

export class ResolveNotificationLinkService {
  private menuRepository: IMenuRepository;

  constructor(menuRepository: IMenuRepository) {
    this.menuRepository = menuRepository;
  }

  async handle({
    type,
    metadata,
  }: ResolveNotificationLinkParams): Promise<string | null> {
    const viewType = NOTIFICATION_VIEW_TYPES[type];
    const cache = makeCache();

    const slug = await cache.remember(
      `${cache.keys.menus}_slug_${viewType}`,
      Constants.CACHE_TTL.menus,
      async () =>
        await this.menuRepository.findSlugByViewType({
          viewType,
          forAudience: MenuAudienceType.ESTABLISHMENT_OWNER,
        }),
    );

    if (!slug) return null;

    const orderId =
      metadata && typeof metadata === "object" && "orderId" in metadata
        ? metadata.orderId
        : null;

    return orderId ? `/${slug}?orderId=${String(orderId)}` : `/${slug}`;
  }
}
