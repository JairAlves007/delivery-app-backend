import { ResourceType } from "@/generated/prisma/client.js";
import { isEstablishmentOpen } from "@/helpers/establishment.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type {
  HubEstablishmentCard,
  HubEstablishmentFromRepository,
} from "@/types/hub.js";

export const mapHubEstablishment = (
  establishment: HubEstablishmentFromRepository,
): HubEstablishmentCard => {
  const resources = mapObjectResourcesList(establishment.resources);
  const coverImage =
    resources[ResourceType.LOGO]?.path ??
    resources[ResourceType.BANNER]?.path ??
    resources[ResourceType.THUMBNAIL]?.path ??
    null;

  const address = establishment.address?.address ?? null;

  return {
    id: establishment.id,
    slug: establishment.slug,
    name: establishment.name,
    description: establishment.description,
    coverImage,
    isOpen: isEstablishmentOpen({
      closures: establishment.closures,
      openingHours: establishment.openingHours,
    }),
    only_delivery: establishment.only_delivery,
    accepts_credit_card: establishment.accepts_credit_card,
    tags: establishment.tags
      .filter((tag) => tag.deleted_at === null)
      .map((tag) => ({ id: tag.id, label: tag.label, type: tag.type })),
    address: address
      ? {
          city: address.city,
          state: address.state,
          neighborhood: address.neighborhood,
        }
      : null,
  };
};

export const mapHubEstablishments = (
  establishments: HubEstablishmentFromRepository[],
): HubEstablishmentCard[] => establishments.map(mapHubEstablishment);
