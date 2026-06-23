import { makeTagCombinationRepository } from "@/factories/repositories/make-tag-combination-repository.js";
import { CreateTagCombinationService } from "@/services/tag-combination/create-tag-combination-service.js";

export const makeCreateTagCombinationService = () => {
  return new CreateTagCombinationService(makeTagCombinationRepository());
};
