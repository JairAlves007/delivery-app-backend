import { makeTagRepository } from "@/factories/repositories/make-tag-repository.js";
import { UpdateTagService } from "@/services/tag/update-tag-service.js";

export const makeUpdateTagService = () => {
	const tagRepository = makeTagRepository();
	return new UpdateTagService(tagRepository);
};
