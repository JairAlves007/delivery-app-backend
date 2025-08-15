import { GenerateSignedUrlForUploadService } from "@/services/generate-signed-url-for-upload.ts";

export const makeGenerateSignedUrlForUploadService = () => {
	return new GenerateSignedUrlForUploadService();
};
