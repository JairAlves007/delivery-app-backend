import z from "zod";

import { IncorrectResourceSize } from "@/errors/resource/incorrect-resource-size-error.js";
import { InvalidResource } from "@/errors/resource/invalid-resource-error.js";
import { UnavailableResourceMimeType } from "@/errors/resource/unavailable-resource-mime-type-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import {
	forgetCacheByForResource,
	getInfoByForResource,
	mapMimeTypeToFileFormat
} from "@/helpers/resource.js";
import { SignedUrl } from "@/helpers/signed-url.js";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.js";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema.js";
import type { ResourceIntent } from "@/types/resource.js";
import type { ValidateResourceRuleParams } from "@/types/resource-rule.js";

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

	private async validateResourceRule({
		resourceIntent
	}: ValidateResourceRuleParams) {
		try {
			const cache = makeCache();
			const key = `${cache.keys.resourceRules}_${resourceIntent.type}_${resourceIntent.for}_${resourceIntent.width}_${resourceIntent.height}_${resourceIntent.mimeType}`;

			const resourceRule = await cache.rememberForever(
				key,
				async () =>
					await this.resourceRepository.validateResourceRule({
						resourceIntent
					})
			);

			if (!resourceRule) throw new InvalidResource();

			if (resourceRule.width !== resourceIntent.width)
				throw new IncorrectResourceSize("width");

			if (resourceRule.height !== resourceIntent.height)
				throw new IncorrectResourceSize("height");

			const isMimeTypeValid = resourceRule.availableFormats.some(
				({ type }) => type === mapMimeTypeToFileFormat(resourceIntent.mimeType)
			);

			if (!isMimeTypeValid) throw new UnavailableResourceMimeType();
		} catch (error) {
			throw error;
		}
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
			const resourcePromises = [];

			await this.validateResourceRule({
				resourceIntent
			});

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

			resourcePromises.push(
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

			resourcePromises.push(forgetCacheByForResource(resourceIntent.for));

			await Promise.all(resourcePromises);

			return {
				signedUrl,
				fileKey
			};
		} catch (error) {
			throw error;
		}
	}
}
