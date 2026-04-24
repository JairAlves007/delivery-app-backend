import z from "zod";

import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import { createTagBodySchema } from "@/schemas/tag-schema.js";

type CreateTagServiceRequest = z.infer<typeof createTagBodySchema> & {
	establishmentId: string;
};

export class CreateTagService {
	private tagRepository: ITagRepository;

	constructor(tagRepository: ITagRepository) {
		this.tagRepository = tagRepository;
	}

	async handle({
		type,
		label,
		combinableTagIds,
		establishmentId
	}: CreateTagServiceRequest) {
		const tag = await this.tagRepository.create({
			type,
			label,
			establishment: {
				connect: { id: establishmentId }
			}
		});

		if (combinableTagIds && combinableTagIds.length > 0) {
			if (tag) {
				await this.tagRepository.syncCombinations({
					tagId: tag.id,
					combinableTagIds,
					establishmentId
				});
			}
		}
	}
}
