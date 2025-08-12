import { GenerateSignedUrlForUploadService } from "@/services/generate-signed-url-for-upload";

export const makeGenerateSignedUrlForUploadService = () => {
	return new GenerateSignedUrlForUploadService();
};
