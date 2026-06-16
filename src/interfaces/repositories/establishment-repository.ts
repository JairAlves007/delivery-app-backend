import type {
  Establishment,
  Prisma,
  SocialPlatform,
  WeekDay,
} from "@/generated/prisma/client.js";
import type { EstablishmentFromRepository } from "@/types/establishment.js";
import type {
  HubCuisine,
  HubEstablishmentFromRepository,
  HubListFilter,
} from "@/types/hub.js";

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

export type BillingDueEstablishment = {
  id: string;
  name: string;
  next_billing_date: Date;
};

export type FindBillingDueBetweenParams = {
  start: Date;
  end: Date;
};

export interface IEstablishmentRepository extends ICRUDBase<
  EstablishmentFromRepository,
  Prisma.EstablishmentCreateInput,
  Prisma.EstablishmentUpdateInput,
  string,
  Establishment
> {
  findBySlug(slug: string): Promise<EstablishmentFromRepository | null>;
  findBillingDueBetween(
    params: FindBillingDueBetweenParams,
  ): Promise<BillingDueEstablishment[]>;
  replaceOpeningHours(params: {
    establishmentId: string;
    items: OpeningHourInputItem[];
  }): Promise<void>;
  upsertSocialLinks(params: {
    establishmentId: string;
    items: SocialLinkUpsertItem[];
  }): Promise<void>;
  paginateListedForHub(params: {
    page: number;
    perPage: number;
    filter: HubListFilter;
  }): Promise<HubEstablishmentFromRepository[]>;
  cursorPaginateListedForHub(params: {
    limit: number;
    cursor?: string | null;
    filter: HubListFilter;
  }): Promise<HubEstablishmentFromRepository[]>;
  countListedForHub(filter: HubListFilter): Promise<number>;
  listAllListedForHub(
    filter: HubListFilter,
  ): Promise<HubEstablishmentFromRepository[]>;
  listDistinctHubCuisines(): Promise<HubCuisine[]>;
}
