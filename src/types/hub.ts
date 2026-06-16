import type z from "zod";

import type { Prisma, TagType } from "@/generated/prisma/client.js";
import type {
  hubCuisineSchema,
  hubEstablishmentCardSchema,
} from "@/schemas/response-schema.js";

export type HubEstablishmentFromRepository = Prisma.EstablishmentGetPayload<{
  include: {
    address: {
      select: {
        address: true;
      };
    };
    resources: {
      select: {
        resource: true;
      };
    };
    tags: true;
    openingHours: true;
    closures: true;
  };
}>;

export type HubEstablishmentCard = z.infer<typeof hubEstablishmentCardSchema>;

export type HubCuisine = z.infer<typeof hubCuisineSchema>;

export type HubListFilter = {
  search?: string | null;
  cuisine?: TagType | null;
};
