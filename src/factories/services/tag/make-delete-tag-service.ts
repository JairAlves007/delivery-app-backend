import { makeTagRepository } from "@/factories/repositories/make-tag-repository.js";
import { DeleteTagService } from "@/services/tag/delete-tag-service.js";

export const makeDeleteTagService = () => {
	const tagRepository = makeTagRepository();
	return new DeleteTagService(tagRepository);
};
