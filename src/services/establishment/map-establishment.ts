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
      closures: mapped.closures,
      openingHours: mapped.openingHours,
    }),
  };
};

export const mapEstablishments = (
  establishments: EstablishmentFromRepository[],
): EstablishmentsList[] => establishments.map(mapEstablishment);
