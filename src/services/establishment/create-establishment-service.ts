import z from "zod";

import { slugify } from "@/helpers/utils.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createEstablishmentBodySchema } from "@/schemas/establishment-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type CreateEstablishmentServiceParams = z.infer<
  typeof createEstablishmentBodySchema
> &
  Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateEstablishmentService {
  private establishmentRepository: IEstablishmentRepository;

  constructor(establishmentRepository: IEstablishmentRepository) {
    this.establishmentRepository = establishmentRepository;
  }

  async handle({
    name,
    address: {
      postalCode: postal_code,
      referencePoint: reference_point,
      ...address
    },
    acceptsCreditCard: accepts_credit_card,
    acceptsScheduling: accepts_scheduling,
    onlyDelivery: only_delivery,
    nextBillingDate: next_billing_date,
    openingHours,
    socialLinks,
    paramsToForget,
    ...data
  }: CreateEstablishmentServiceParams): Promise<void> {
    const socialLinksToCreate = (socialLinks ?? []).filter(
      (link): link is { platform: typeof link.platform; url: string } =>
        link.url !== null,
    );

    await this.establishmentRepository.create({
      ...data,
      name,
      slug: slugify(name),
      accepts_credit_card,
      accepts_scheduling,
      only_delivery,
      next_billing_date,
      address: {
        create: {
          address: {
            create: {
              ...address,
              reference_point,
              postal_code,
            },
          },
        },
      },
      ...(openingHours && openingHours.length > 0
        ? {
            openingHours: {
              create: openingHours.map((h) => ({
                day_of_week: h.dayOfWeek,
                opens_at: h.isClosed ? "00:00" : (h.opensAt ?? "00:00"),
                closes_at: h.isClosed ? "00:00" : (h.closesAt ?? "00:00"),
                is_closed: h.isClosed,
              })),
            },
          }
        : {}),
      ...(socialLinksToCreate.length > 0
        ? {
            socialLinks: {
              create: socialLinksToCreate.map((link) => ({
                platform: link.platform,
                url: link.url,
              })),
            },
          }
        : {}),
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "establishments",
      paramsToForget,
    });
  }
}
