import { makeCache } from "@/factories/services/cache/make-cache.js";
import {
  MenuAudienceType,
  NotificationType,
  type Prisma,
  ViewType,
} from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.js";

const NOTIFICATION_VIEW_TYPES: Record<NotificationType, ViewType | null> = {
  [NotificationType.ORDER_CREATED]: ViewType.VIEW_ORDERS,
  [NotificationType.LOW_STOCK]: ViewType.VIEW_PRODUCTS,
  [NotificationType.BILLING_DUE]: null,
};

const NOTIFICATION_LINK_PARAMS: Record<
  NotificationType,
  { metadataKey: string; queryKey: string } | null
> = {
  [NotificationType.ORDER_CREATED]: {
    metadataKey: "orderId",
    queryKey: "orderId",
  },
  [NotificationType.LOW_STOCK]: {
    metadataKey: "productId",
    queryKey: "productId",
  },
  [NotificationType.BILLING_DUE]: null,
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

    if (!viewType) return null;

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

    const linkParams = NOTIFICATION_LINK_PARAMS[type];

    if (!linkParams) return `/${slug}`;

    const { metadataKey, queryKey } = linkParams;

    const value =
      metadata && typeof metadata === "object" && metadataKey in metadata
        ? (metadata as Record<string, unknown>)[metadataKey]
        : null;

    return value ? `/${slug}?${queryKey}=${String(value)}` : `/${slug}`;
  }
}
