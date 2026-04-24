import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

type DeleteTagServiceRequest = {
	id: number;
} & Pick<ForgetAllListingCacheKeysParams, "paramsToForget">;

export class DeleteTagService {
	private tagRepository: ITagRepository;

	constructor(tagRepository: ITagRepository) {
		this.tagRepository = tagRepository;
	}

	async handle({ id, paramsToForget }: DeleteTagServiceRequest) {
		await this.tagRepository.delete({
			id,
			force: false
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "tags",
			paramsToForget
		});
	}
}
