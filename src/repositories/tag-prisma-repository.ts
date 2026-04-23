import { transformValidFilterParams } from "@/helpers/crud.js";
import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import prisma from "@/lib/prisma.js";
import type { FilterParams } from "@/types/crud.js";
import type { TagFromRepository } from "@/types/tag.js";

export class TagPrismaRepository implements ITagRepository {
	async listAll(filterParams?: FilterParams): Promise<TagFromRepository[]> {
		const params = transformValidFilterParams(filterParams);

		return await prisma.tag.findMany({
			where: {
				deleted_at: null,
				...params
			},
			orderBy: { label: "asc" }
		});
	}
}
