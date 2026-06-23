import z from "zod";

import { InvalidPage } from "@/errors/pagination/invalid-page.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { Combo } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IComboRepository } from "@/interfaces/repositories/combo-repository.js";
import { listQueryParamsSchema } from "@/schemas/generic-schema.js";
import type { FilterField, PaginatedResponse } from "@/types/crud.js";

type ListComboServiceRequest = z.infer<typeof listQueryParamsSchema> &
  FilterField;

type ListComboServiceResponse = PaginatedResponse<Combo>;

export class ListComboService {
  private comboRepository: IComboRepository;

  constructor(comboRepository: IComboRepository) {
    this.comboRepository = comboRepository;
  }

  async handle({
    page,
    perPage,
    filterParams,
  }: ListComboServiceRequest): Promise<ListComboServiceResponse> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey(filterParams);

    const isPaging = !!page;
    const totalPromise = cache.remember(
      `${prefixKey}total_${cache.keys.combos}`,
      Constants.CACHE_TTL.combos,
      async () => await this.comboRepository.count(filterParams),
      { domain: "combos", establishmentId: filterParams?.establishment_id },
    );

    if (isPaging) {
      const key = `${prefixKey}${cache.keys.combos}_page_${page}_per_page_${perPage}`;

      const [total, combos] = await Promise.all([
        totalPromise,
        cache.remember(
          key,
          Constants.CACHE_TTL.combos,
          async () =>
            await this.comboRepository.paginate({ page, perPage, filterParams }),
          { domain: "combos", establishmentId: filterParams?.establishment_id },
        ),
      ]);

      const totalPages = Math.ceil(total / perPage);

      if (page > totalPages && totalPages > 0) {
        await cache.forget(key);
        throw new InvalidPage();
      }

      return {
        items: combos,
        pagination: { page, perPage, total, totalPages },
      };
    }

    const [total, combos] = await Promise.all([
      totalPromise,
      cache.remember(
        `${prefixKey}all_${cache.keys.combos}`,
        Constants.CACHE_TTL.combos,
        async () => await this.comboRepository.listAll(filterParams),
        { domain: "combos", establishmentId: filterParams?.establishment_id },
      ),
    ]);

    return {
      items: combos,
      pagination: { page: 1, perPage: total, total, totalPages: 1 },
    };
  }
}
