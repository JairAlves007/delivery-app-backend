import z from "zod";

import { IncorrectResourceSize } from "@/errors/resource/incorrect-resource-size-error.js";
import { InvalidResource } from "@/errors/resource/invalid-resource-error.js";
import { UnavailableResourceMimeType } from "@/errors/resource/unavailable-resource-mime-type-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import {
	forgetCacheByForResource,
	getInfoByForResource,
	mapMimeTypeToFileFormat
} from "@/helpers/resource.js";
import { SignedUrl } from "@/helpers/signed-url.js";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.js";
import { enqueueDeleteR2Object } from "@/queues/resource-queue.js";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { ResourceIntent } from "@/types/resource.js";
import type { ValidateResourceRuleParams } from "@/types/resource-rule.js";

type GenerateSignedUrlForUploadServiceRequest = z.infer<
	typeof uploadSignedUrlBodySchema
> & {
	establishmentId: EstablishmentID;
};
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
		const cache = makeCache();
		const key = `${cache.keys.resourceRules}_${resourceIntent.type}_${resourceIntent.for}_${resourceIntent.width}_${resourceIntent.height}_${resourceIntent.mimeType}`;

		const resourceRule = await cache.remember(
			key,
			Constants.CACHE_TTL.resourceRules,
			async () =>
				await this.resourceRepository.validateResourceRule({
					resourceIntent
				}),
			{ domain: "resourceRules" }
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
	}

	async handle({
		establishmentId,
		resourceId,
		objectId,
		resource
	}: GenerateSignedUrlForUploadServiceRequest): Promise<SignedUrlDetail> {
		const resourceIntent: ResourceIntent = resource;

		const resourcePromises = [];

		await this.validateResourceRule({
			resourceIntent
		});

		const oldLocation = resourceId
			? await this.resourceRepository.findResourceLocationById({
					resourceId,
					establishmentId
				})
			: null;

		const { path, attachData } = getInfoByForResource(resourceIntent, objectId);

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

		if (oldLocation) {
			const oldBucketKey = `${oldLocation.path}/${oldLocation.file_key}`;
			const newBucketKey = `${path}/${fileKey}`;

			if (oldBucketKey !== newBucketKey) {
				await enqueueDeleteR2Object({ bucketKey: oldBucketKey });
			}
		}

		return {
			signedUrl,
			fileKey
		};
	}
}
