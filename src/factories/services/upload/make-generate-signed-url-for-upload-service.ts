import { makeResourceRepository } from "@/factories/repositories/make-resource-repository.js";
import { GenerateSignedUrlForUploadService } from "@/services/upload/generate-signed-url-for-upload.js";

export const makeGenerateSignedUrlForUploadService = () => {
  const resourceRepository = makeResourceRepository();

  return new GenerateSignedUrlForUploadService(resourceRepository);
};
