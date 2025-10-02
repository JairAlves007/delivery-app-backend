import { InvalidResource } from "@/errors/resource/invalid-resource-error.ts";
import {
	forgetCacheByForResource,
	getInfoByForResource
} from "@/helpers/resource.ts";
import { SignedUrl } from "@/helpers/signed-url.ts";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
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

export class GenerateSignedUrlForUploadService {
	private resourceRepository: IResourceRepository;

	constructor(resourceRepository: IResourceRepository) {
		this.resourceRepository = resourceRepository;
	}

	async handle({
		establishmentId,
		resourceId,
		objectId,
		resource
	}: GenerateSignedUrlForUploadServiceRequest): Promise<SignedUrlDetail> {
		// TODO: In future, add wrangler-queues for r2-upload-events to validate signed urls and fire events when my file was uploaded
		// TODO: In future, add wrangler-queues for r2-delete-events to validate signed urls and fire events when my file was deleted
		// TODO: In future, improve store db logic

		const resourceIntent: ResourceIntent = resource;

		try {
			const resourcesPromise = [];

			const resourceRule = await this.resourceRepository.validateResourceRule(
				resourceIntent
			);

			if (!resourceRule) throw new InvalidResource();

			const { path, attachData } = getInfoByForResource(
				resourceIntent,
				objectId
			);

			const { signedUrl, fileKey } = await SignedUrl.createUploadSignedUrl(
				path,
				resourceIntent.mimeType
			);

			const resourceInput = {
				type: resourceIntent.type,
				path,
				file_key: fileKey,
				establishment: {
					connect: {
						id: establishmentId
					}
				}
			};

			const where = resourceId
				? { id: resourceId }
				: {
						establishment_id_file_key: {
							establishment_id: establishmentId,
							file_key: fileKey
						}
				  };

			resourcesPromise.push(
				this.resourceRepository.storeResource({
					create: {
						...resourceInput,
						...attachData
					},
					update: {
						...resourceInput
					},
					where
				})
			);

			resourcesPromise.push(forgetCacheByForResource(resourceIntent.for));

			await Promise.all(resourcesPromise);

			return {
				signedUrl,
				fileKey
			};
		} catch (error) {
			throw error;
		}
	}
}
