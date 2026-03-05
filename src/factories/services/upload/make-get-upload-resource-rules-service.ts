import { makeResourceRepository } from "@/factories/repositories/make-resource-repository.ts";
import { GetUploadResourceRulesService } from "@/services/upload/get-upload-resource-rules.ts";

export const makeGetUploadResourceRulesService = () => {
	const resourceRepository = makeResourceRepository();
	return new GetUploadResourceRulesService(resourceRepository);
};
