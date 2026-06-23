import type { ITagCombinationRepository } from "@/interfaces/repositories/tag-combination-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type DeleteTagCombinationServiceRequest = {
  id: number;
  establishmentId: EstablishmentID;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteTagCombinationService {
  private tagCombinationRepository: ITagCombinationRepository;

  constructor(tagCombinationRepository: ITagCombinationRepository) {
    this.tagCombinationRepository = tagCombinationRepository;
  }

  async handle({
    id,
    establishmentId,
    paramsToForget,
  }: DeleteTagCombinationServiceRequest) {
    await this.tagCombinationRepository.deleteById(id, establishmentId);

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "products",
      paramsToForget,
    });
  }
}
