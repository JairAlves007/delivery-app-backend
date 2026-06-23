import { TagCombinationAlreadyExists } from "@/errors/tag-combination/already-exists.js";
import { TagCombinationInvalidTags } from "@/errors/tag-combination/invalid-tags.js";
import type { ITagCombinationRepository } from "@/interfaces/repositories/tag-combination-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreateTagCombinationServiceRequest = {
  establishmentId: EstablishmentID;
  fromTagId: number;
  toTagId: number;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateTagCombinationService {
  private tagCombinationRepository: ITagCombinationRepository;

  constructor(tagCombinationRepository: ITagCombinationRepository) {
    this.tagCombinationRepository = tagCombinationRepository;
  }

  async handle({
    establishmentId,
    fromTagId,
    toTagId,
    paramsToForget,
  }: CreateTagCombinationServiceRequest) {
    const tagsInEstablishment =
      await this.tagCombinationRepository.countTagsInEstablishment(
        [fromTagId, toTagId],
        establishmentId,
      );

    if (tagsInEstablishment !== 2) throw new TagCombinationInvalidTags();

    const alreadyExists = await this.tagCombinationRepository.exists(
      fromTagId,
      toTagId,
    );

    if (alreadyExists) throw new TagCombinationAlreadyExists();

    await this.tagCombinationRepository.create(fromTagId, toTagId);

    await forgetAllListingCacheKeysQueue({
      baseCacheKey: "products",
      paramsToForget,
    });
  }
}
