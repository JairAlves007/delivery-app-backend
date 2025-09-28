import { SignedUrl } from "@/helpers/signed-url.ts";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema.ts";
import z from "zod";

type GenerateSignedUrlForUploadServiceRequest = z.infer<
	typeof uploadSignedUrlBodySchema
>;
interface SignedUrlDetail {
	signedUrl: string;
	fileKey: string;
}

interface GenerateSignedUrlForUploadServiceResponse {
	uploads: SignedUrlDetail[];
}

export class GenerateSignedUrlForUploadService {
	private resourceRepository: IResourceRepository;

	constructor(resourceRepository: IResourceRepository) {
		this.resourceRepository = resourceRepository;
	}

	async handle({
		resources
	}: GenerateSignedUrlForUploadServiceRequest): Promise<GenerateSignedUrlForUploadServiceResponse> {
		try {
			const uploadDetails: SignedUrlDetail[] = [];

			for (const resourceIntent of resources) {
				const resourceRule = await this.resourceRepository.validateResourceRule(
					resourceIntent
				);

				const { signedUrl, fileKey } = await SignedUrl.createUploadSignedUrl(
					resourceRule.path,
					resourceIntent.fileMimeType
				);

				uploadDetails.push({ signedUrl, fileKey });
			}

			return {
				uploads: uploadDetails
			};
		} catch (error) {
			throw error;
		}
	}
}
