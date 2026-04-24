import z from "zod";

import { TagNotFound } from "@/errors/tag/not-found-error.js";
import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import { updateTagBodySchema } from "@/schemas/tag-schema.js";

interface UpdateTagServiceRequest extends z.infer<typeof updateTagBodySchema> {
	id: number;
	establishmentId: string;
}

export class UpdateTagService {
	private tagRepository: ITagRepository;

	constructor(tagRepository: ITagRepository) {
		this.tagRepository = tagRepository;
	}

	async handle({
		id,
		establishmentId,
		combinableTagIds,
		...data
	}: UpdateTagServiceRequest) {
		const tag = await this.tagRepository.findById({
			id,
			filterParams: { establishment_id: establishmentId }
		});

		if (!tag) throw new TagNotFound();

		if (Object.keys(data).length > 0) {
			await this.tagRepository.update({
				id,
				filterParams: { establishment_id: establishmentId },
				data
			});
		}

		if (combinableTagIds) {
			await this.tagRepository.syncCombinations({
				tagId: id,
				combinableTagIds,
				establishmentId
			});
		}
	}
}
