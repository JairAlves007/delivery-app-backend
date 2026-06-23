import { makeTagCombinationRepository } from "@/factories/repositories/make-tag-combination-repository.js";
import { ListTagCombinationsService } from "@/services/tag-combination/list-tag-combinations-service.js";

export const makeListTagCombinationsService = () => {
  return new ListTagCombinationsService(makeTagCombinationRepository());
};
