import z from "zod";

import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createTagBodySchema } from "@/schemas/tag-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type CreateTagServiceRequest = z.infer<typeof createTagBodySchema> & {
  establishmentId: string;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class CreateTagService {
  private tagRepository: ITagRepository;

  constructor(tagRepository: ITagRepository) {
    this.tagRepository = tagRepository;
  }

  async handle({
    type,
    label,
    combinableTagIds,
    establishmentId,
    paramsToForget,
  }: CreateTagServiceRequest) {
    const tag = await this.tagRepository.create({
      type,
      label,
      establishment: {
        connect: { id: establishmentId },
      },
    });

    if (combinableTagIds && combinableTagIds.length > 0) {
      if (tag) {
        await this.tagRepository.syncCombinations({
          tagId: tag.id,
          combinableTagIds,
          establishmentId,
        });
      }
    }

    if (paramsToForget) {
      await forgetAllListingCacheKeysQueue({
        baseCacheKey: "tags",
        paramsToForget,
      });
    }
  }
}
