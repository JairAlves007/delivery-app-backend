import z from "zod";

import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import prisma from "@/lib/prisma.js";
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
		await this.tagRepository.create({
			type,
			label,
			establishment: {
				connect: { id: establishmentId }
			}
		});

		if (combinableTagIds && combinableTagIds.length > 0) {
			const created = await prisma.tag.findFirst({
				where: {
					type,
					establishment_id: establishmentId,
					deleted_at: null
				},
				select: { id: true }
			});

			if (created) {
				await this.tagRepository.syncCombinations({
					tagId: created.id,
					combinableTagIds,
					establishmentId
				});
			}
		}
	}
}
