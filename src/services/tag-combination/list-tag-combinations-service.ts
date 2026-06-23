import type { TagType } from "@/generated/prisma/client.js";
import type { ITagCombinationRepository } from "@/interfaces/repositories/tag-combination-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ListTagCombinationsServiceRequest = {
  establishmentId: EstablishmentID;
};

type TagSummary = { id: number; label: string; type: TagType };

type TagCombinationItem = {
  id: number;
  from_tag: TagSummary;
  to_tag: TagSummary;
};

export class ListTagCombinationsService {
  private tagCombinationRepository: ITagCombinationRepository;

  constructor(tagCombinationRepository: ITagCombinationRepository) {
    this.tagCombinationRepository = tagCombinationRepository;
  }

  async handle({
    establishmentId,
  }: ListTagCombinationsServiceRequest): Promise<TagCombinationItem[]> {
    const combinations =
      await this.tagCombinationRepository.listByEstablishment(establishmentId);

    return combinations.map((combination) => ({
      id: combination.id,
      from_tag: {
        id: combination.from_tag.id,
        label: combination.from_tag.label,
        type: combination.from_tag.type,
      },
      to_tag: {
        id: combination.to_tag.id,
        label: combination.to_tag.label,
        type: combination.to_tag.type,
      },
    }));
  }
}
