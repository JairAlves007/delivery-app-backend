import { makeTagCombinationRepository } from "@/factories/repositories/make-tag-combination-repository.js";
import { DeleteTagCombinationService } from "@/services/tag-combination/delete-tag-combination-service.js";

export const makeDeleteTagCombinationService = () => {
  return new DeleteTagCombinationService(makeTagCombinationRepository());
};
