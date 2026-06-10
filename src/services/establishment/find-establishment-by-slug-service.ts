import { EstablishmentNotFound } from "@/errors/establishment/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import { getFilterParamsCacheKey } from "@/helpers/crud.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { mapEstablishment } from "@/services/establishment/map-establishment.js";
import type { EstablishmentsList } from "@/types/establishment.js";

export class FindEstablishmentBySlugService {
  private establishmentRepository: IEstablishmentRepository;

  constructor(establishmentRepository: IEstablishmentRepository) {
    this.establishmentRepository = establishmentRepository;
  }

  async handle(slug: string): Promise<EstablishmentsList> {
    const cache = makeCache();
    const prefixKey = getFilterParamsCacheKey({
      establishment_slug: slug,
    });
    const key = `${prefixKey}${cache.keys.establishments}`;

    const establishment = await cache.remember(
      key,
      Constants.CACHE_TTL.establishments,
      async () => await this.establishmentRepository.findBySlug(slug),
      { domain: "establishments" },
    );

    if (!establishment) throw new EstablishmentNotFound();

    return mapEstablishment(establishment);
  }
}
