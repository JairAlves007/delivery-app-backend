import { makeTagRepository } from "@/factories/repositories/make-tag-repository.js";
import { ListTagService } from "@/services/tag/list-tag-service.js";

export const makeListTagService = () => {
  const tagRepository = makeTagRepository();
  return new ListTagService(tagRepository);
};
