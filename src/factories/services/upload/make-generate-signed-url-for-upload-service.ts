import { makeResourceRepository } from "@/factories/repositories/make-resource-repository.ts";
import { GenerateSignedUrlForUploadService } from "@/services/upload/generate-signed-url-for-upload.ts";

export const makeGenerateSignedUrlForUploadService = () => {
	const resourceRepository = makeResourceRepository();

	return new GenerateSignedUrlForUploadService(resourceRepository);
};
