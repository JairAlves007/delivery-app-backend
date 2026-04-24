import type { Prisma } from "@/generated/prisma/client.js";
import type { FilterParams } from "@/types/crud.js";
import type { TagWithCombinationsFromRepository } from "@/types/tag.js";

import type { ICRUDBase } from "../crud-base.js";

export interface ITagRepository
	extends ICRUDBase<
		TagWithCombinationsFromRepository,
		Prisma.TagCreateInput,
		Prisma.TagUpdateInput,
		number
	> {
	listAll(
		filterParams?: FilterParams
	): Promise<TagWithCombinationsFromRepository[]>;
	syncCombinations(params: {
		tagId: number;
		combinableTagIds: number[];
		establishmentId: string;
	}): Promise<void>;
}
