import { env } from "@/env.ts";
import { r2 } from "@/lib/cloudflare.ts";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Constants from "./constants.ts";

interface CreateUploadSignedUrlResponse {
	signedUrl: string;
	fileKey: string;
}

export class SignedUrl {
	static async createUploadSignedUrl(
		prefixPath: string,
		contentType: string
	): Promise<CreateUploadSignedUrlResponse> {
		const finalPrefixPath = prefixPath.replace(/^\/+|\/+$/g, "");
		const extension = contentType.split("/")[1];
		const uniqueString =
			Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
		const fileKey = `${uniqueString}.${extension}`;

		const signedUrl = await getSignedUrl(
			r2,
			new PutObjectCommand({
				Bucket: env.CLOUDFLARE_BUCKET_NAME,
				Key: `${finalPrefixPath}/${fileKey}`,
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
	}
}
