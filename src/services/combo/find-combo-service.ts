import z from "zod";

import { ComboNotFound } from "@/errors/combo/not-found.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import { transformPriceFromDatabase } from "@/helpers/price.js";
import type { IComboRepository } from "@/interfaces/repositories/combo-repository.js";
import { comboParamsSchema } from "@/schemas/combo-schema.js";
import { mapCombo } from "@/services/combo/map-combo.js";
import type { FilterField } from "@/types/crud.js";

type FindComboServiceRequest = z.infer<typeof comboParamsSchema> & FilterField;

export class FindComboService {
  private comboRepository: IComboRepository;

  constructor(comboRepository: IComboRepository) {
    this.comboRepository = comboRepository;
  }

  async handle({ id, filterParams }: FindComboServiceRequest) {
    const cache = makeCache();
    const filterPrefixKey = getFilterParamsCacheKey(filterParams);
    const key = `${filterPrefixKey}${cache.keys.combos}_${id}`;

    const combo = await cache.remember(
      key,
      Constants.CACHE_TTL.combos,
      async () =>
        await this.comboRepository.findByIdWithRelations({ id, filterParams }),
      { domain: "combos", establishmentId: filterParams?.establishment_id },
    );

    if (!combo) throw new ComboNotFound();

    return mapCombo(combo, transformPriceFromDatabase);
  }
}
