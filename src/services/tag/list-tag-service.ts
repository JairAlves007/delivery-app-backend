import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import type { FilterField } from "@/types/crud.js";
import type { TagList } from "@/types/tag.js";

type ListTagServiceResponse = {
	items: TagList[];
};

export class ListTagService {
	private tagRepository: ITagRepository;

	constructor(tagRepository: ITagRepository) {
		this.tagRepository = tagRepository;
	}

	async handle({ filterParams }: FilterField): Promise<ListTagServiceResponse> {
		const tags = await this.tagRepository.listAll(filterParams);

		return { items: tags };
	}
}
