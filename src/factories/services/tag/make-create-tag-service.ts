import { makeTagRepository } from "@/factories/repositories/make-tag-repository.js";
import { CreateTagService } from "@/services/tag/create-tag-service.js";

export const makeCreateTagService = () => {
	const tagRepository = makeTagRepository();
	return new CreateTagService(tagRepository);
};
