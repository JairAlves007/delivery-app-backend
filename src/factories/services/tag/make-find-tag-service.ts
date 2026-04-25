import { makeTagRepository } from "@/factories/repositories/make-tag-repository.js";
import { FindTagService } from "@/services/tag/find-tag-service.js";

export const makeFindTagService = () => {
  const tagRepository = makeTagRepository();
  return new FindTagService(tagRepository);
};
