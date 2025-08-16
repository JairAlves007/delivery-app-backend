import { SignedUrl } from "@/helpers/signed-url.ts";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema.ts";
import z from "zod";

type GenerateSignedUrlForUploadServiceRequest = z.infer<
	typeof uploadSignedUrlBodySchema
>;

interface GenerateSignedUrlForUploadServiceResponse {
	signedUrl: string;
	fileKey: string;
}

export class GenerateSignedUrlForUploadService {
	async handle({
		contentType
	}: GenerateSignedUrlForUploadServiceRequest): Promise<GenerateSignedUrlForUploadServiceResponse> {
		try {
			const { signedUrl, fileKey } = await SignedUrl.createUploadSignedUrl(
				"establishments/logos",
				contentType
			);

			return {
				signedUrl,
				fileKey
			};
		} catch (error) {
			throw error;
		}
	}
}
