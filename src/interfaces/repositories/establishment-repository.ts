import type {
  Establishment,
  Prisma,
  SocialPlatform,
  WeekDay,
} from "@/generated/prisma/client.js";
import type { EstablishmentFromRepository } from "@/types/establishment.js";

import type { ICRUDBase } from "../crud-base.js";

export type OpeningHourInputItem = {
  day_of_week: WeekDay;
  opens_at: string;
  closes_at: string;
  is_closed: boolean;
};

export type SocialLinkUpsertItem = {
  platform: SocialPlatform;
  url: string | null;
};

export interface IEstablishmentRepository extends ICRUDBase<
  EstablishmentFromRepository,
  Prisma.EstablishmentCreateInput,
  Prisma.EstablishmentUpdateInput,
  string,
  Establishment
> {
  findBySlug(slug: string): Promise<EstablishmentFromRepository | null>;
  replaceOpeningHours(params: {
    establishmentId: string;
    items: OpeningHourInputItem[];
  }): Promise<void>;
  upsertSocialLinks(params: {
    establishmentId: string;
    items: SocialLinkUpsertItem[];
  }): Promise<void>;
}
