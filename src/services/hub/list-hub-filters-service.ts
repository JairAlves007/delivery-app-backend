import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import type { ListResponse } from "@/types/crud.js";
import type { HubCuisine } from "@/types/hub.js";

type ListHubFiltersServiceResponse = ListResponse<HubCuisine>;

export class ListHubFiltersService {
  private establishmentRepository: IEstablishmentRepository;

  constructor(establishmentRepository: IEstablishmentRepository) {
    this.establishmentRepository = establishmentRepository;
  }

  async handle(): Promise<ListHubFiltersServiceResponse> {
    const cache = makeCache();

    const cuisines = await cache.remember(
      `hub_cuisines_${cache.keys.establishments}`,
      Constants.CACHE_TTL.establishments,
      async () => await this.establishmentRepository.listDistinctHubCuisines(),
      { domain: "establishments" },
    );

    return { items: cuisines };
  }
}
