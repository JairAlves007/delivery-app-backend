import z from "zod";

import { BannerLinkType } from "@/generated/prisma/client.js";
import type { IBannerRepository } from "@/interfaces/repositories/banner-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateBannerBodySchema } from "@/schemas/banner-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";

interface UpdateBannerServiceRequest
	extends
		z.infer<typeof updateBannerBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: number;
}

export class UpdateBannerService {
	private bannerRepository: IBannerRepository;

	constructor(bannerRepository: IBannerRepository) {
		this.bannerRepository = bannerRepository;
	}

	async handle({
		id,
		establishmentId,
		categoryId,
		productId,
		linkType: link_type,
		paramsToForget,
		...data
	}: UpdateBannerServiceRequest) {
		await this.bannerRepository.update({
			id,
			data: {
				...data,
				link_type,
				establishment: {
					connect: {
						id: establishmentId
					}
				},
				...(!!categoryId &&
					link_type === BannerLinkType.CATEGORY && {
						category: {
							connect: { id: categoryId }
						}
					}),
				...(!!productId &&
					link_type === BannerLinkType.PRODUCT && {
						product: {
							connect: { id: productId }
						}
					})
			}
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "addresses",
			paramsToForget
		});
	}
}
