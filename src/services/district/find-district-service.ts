import z from "zod";

import { DistrictNotFound } from "@/errors/district/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { District } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IDistrictRepository } from "@/interfaces/repositories/district-repository.js";
import { districtParamsSchema } from "@/schemas/district-schema.js";
import type { FilterField } from "@/types/crud.js";

type FindDistrictServiceRequest = z.infer<typeof districtParamsSchema> &
  FilterField;

export class FindDistrictService {
  private districtRepository: IDistrictRepository;

  constructor(districtRepository: IDistrictRepository) {
    this.districtRepository = districtRepository;
  }

  async handle({
    id,
    filterParams,
  }: FindDistrictServiceRequest): Promise<District> {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);
    const key = `${filterPrefixKey}${cache.keys.districts}_${id}`;

    const district = await cache.remember(
      key,
      Constants.CACHE_TTL.districts,
      async () => await this.districtRepository.findById({ id, filterParams }),
    );

    if (!district) throw new DistrictNotFound();

    return district;
  }
}
