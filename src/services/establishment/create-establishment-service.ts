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
    onlyDelivery: only_delivery,
    nextBillingDate: next_billing_date,
    paramsToForget,
    ...data
  }: CreateEstablishmentServiceParams): Promise<void> {
    await this.establishmentRepository.create({
      ...data,
      name,
      slug: slugify(name),
      accepts_credit_card,
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
    });

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "establishments",
      paramsToForget,
    });
  }
}
