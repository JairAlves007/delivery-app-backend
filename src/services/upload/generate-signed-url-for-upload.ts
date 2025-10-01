import { InvalidResource } from "@/errors/resource/invalid-resource-error.ts";
import { attachObjectResource, getResourcePath } from "@/helpers/resource.ts";
import { SignedUrl } from "@/helpers/signed-url.ts";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema.ts";
import type { ResourceIntent } from "@/types/resource.ts";
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
		establishmentId,
		objectId,
		forResource,
		resources
	}: GenerateSignedUrlForUploadServiceRequest): Promise<GenerateSignedUrlForUploadServiceResponse> {
		// TODO: In future, add wrangler-queues for r2-upload-events to validate signed urls and fire events when my file was uploaded
		// TODO: In future, add wrangler-queues for r2-delete-events to validate signed urls and fire events when my file was deleted
		// TODO: In future, improve store db logic

		const resourcesNonDuplicate: ResourceIntent[] = Array.from(
			new Set(
				resources.map(resource => {
					return JSON.stringify(resource);
				})
			)
		).map(jsonString => JSON.parse(jsonString));

		try {
			const uploadDetails: SignedUrlDetail[] = [];
			const resourcesPromise = [];

			for (const resourceIntent of resourcesNonDuplicate) {
				const resourceRule = await this.resourceRepository.validateResourceRule(
					forResource,
					resourceIntent
				);

				if (!resourceRule) throw new InvalidResource();

				const path = getResourcePath(forResource, resourceIntent.type);

				const objectIdResource = attachObjectResource(forResource, objectId);

				const { signedUrl, fileKey } = await SignedUrl.createUploadSignedUrl(
					path,
					resourceIntent.mimeType
				);

				resourcesPromise.push(
					this.resourceRepository.storeResource({
						type: resourceIntent.type,
						path,
						file_key: fileKey,
						establishment: {
							connect: {
								id: establishmentId
							}
						},
						...objectIdResource
					})
				);

				uploadDetails.push({ signedUrl, fileKey });
			}

			await Promise.all(resourcesPromise);

			return {
				uploads: uploadDetails
			};
		} catch (error) {
			throw error;
		}
	}
}
