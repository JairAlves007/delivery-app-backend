import type {
  TagDetail,
  TagWithCombinationsFromRepository,
} from "@/types/tag.js";

export const mapTagWithCombinations = (
  tag: TagWithCombinationsFromRepository,
): TagDetail => ({
  id: tag.id,
  label: tag.label,
  type: tag.type,
  combinableTags: tag.fromTags.map((fromTag) => ({
    id: fromTag.to_tag.id,
    label: fromTag.to_tag.label,
    type: fromTag.to_tag.type,
  })),
});
