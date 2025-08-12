import { env } from "@/env";
import Constants from "@/helpers/constants";
import { r2 } from "@/lib/cloudflare";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
			const extension = contentType.split("/")[1];
			const uniqueString =
				Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
			const fileKey = `${uniqueString}.${extension}`;

			const signedUrl = await getSignedUrl(
				r2,
				new PutObjectCommand({
					Bucket: env.CLOUDFLARE_BUCKET_NAME,
					Key: fileKey,
					ContentType: contentType
				}),
				{
					expiresIn: Constants.SIGNED_URL_EXPIRES_IN_MINUTES
				}
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
