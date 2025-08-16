import { GenerateSignedUrlForUploadService } from "@/services/upload/generate-signed-url-for-upload.ts";

export const makeGenerateSignedUrlForUploadService = () => {
	return new GenerateSignedUrlForUploadService();
};
