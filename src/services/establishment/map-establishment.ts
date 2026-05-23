import { isEstablishmentOpen } from "@/helpers/establishment.js";
import { mapObjectResourcesList } from "@/helpers/resource.js";
import type {
  EstablishmentFromRepository,
  EstablishmentsList,
} from "@/types/establishment.js";

export const mapEstablishment = (
  establishment: EstablishmentFromRepository,
): EstablishmentsList => {
  const mapped = {
    ...establishment,
    address: establishment.address?.address ?? null,
    resources: mapObjectResourcesList(establishment.resources),
  };

  return {
    ...mapped,
    isOpen: isEstablishmentOpen({
      is_manually_closed: mapped.is_manually_closed,
      closures: mapped.closures,
      openingHours: mapped.openingHours,
    }),
  };
};

export const mapEstablishments = (
  establishments: EstablishmentFromRepository[],
): EstablishmentsList[] => establishments.map(mapEstablishment);
