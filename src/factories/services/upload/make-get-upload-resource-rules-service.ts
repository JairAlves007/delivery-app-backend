import { makeResourceRepository } from "@/factories/repositories/make-resource-repository.js";
import { GetUploadResourceRulesService } from "@/services/upload/get-upload-resource-rules.js";

export const makeGetUploadResourceRulesService = () => {
  const resourceRepository = makeResourceRepository();
  return new GetUploadResourceRulesService(resourceRepository);
};
