import type { FilterParams } from "@/types/crud.js";
import type { TagFromRepository } from "@/types/tag.js";

export interface ITagRepository {
	listAll(filterParams?: FilterParams): Promise<TagFromRepository[]>;
}
