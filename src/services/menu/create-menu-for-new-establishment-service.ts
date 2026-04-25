import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreateMenuForNewEstablishmentParams = {
  establishmentId: EstablishmentID;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateMenuForNewEstablishmentService {
  private menuRepository: IMenuRepository;

  constructor(menuRepository: IMenuRepository) {
    this.menuRepository = menuRepository;
  }

  async handle({
    establishmentId,
    paramsToForget,
  }: CreateMenuForNewEstablishmentParams) {
    await this.menuRepository.createForNewEstablishment(establishmentId);

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "establishments",
      paramsToForget,
    });
  }
}
