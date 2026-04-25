import { TagNotFound } from "@/errors/tag/not-found-error.js";
import type { ITagRepository } from "@/interfaces/repositories/tag-repository.js";
import { mapTagWithCombinations } from "@/services/tag/map-tag.js";
import type { FilterField } from "@/types/crud.js";
import type { TagDetail } from "@/types/tag.js";

type FindTagServiceRequest = {
  id: number;
} & FilterField;

export class FindTagService {
  private tagRepository: ITagRepository;

  constructor(tagRepository: ITagRepository) {
    this.tagRepository = tagRepository;
  }

  async handle({
    id,
    filterParams,
  }: FindTagServiceRequest): Promise<TagDetail> {
    const tag = await this.tagRepository.findById({ id, filterParams });

    if (!tag) throw new TagNotFound();

    return mapTagWithCombinations(tag);
  }
}
