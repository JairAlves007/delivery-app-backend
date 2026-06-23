import z from "zod";

import { ComboType, type Prisma } from "@/generated/prisma/client.js";
import { transformPriceToDatabase } from "@/helpers/price.js";
import { slugify } from "@/helpers/utils.js";
import type { IComboRepository } from "@/interfaces/repositories/combo-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { createComboBodySchema } from "@/schemas/combo-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

type CreateComboServiceRequest = z.infer<typeof createComboBodySchema> &
	Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> & {
		establishmentId: EstablishmentID;
	};

export class CreateComboService {
	private comboRepository: IComboRepository;

	constructor(comboRepository: IComboRepository) {
		this.comboRepository = comboRepository;
	}

	async handle({
		establishmentId,
		name,
		description,
		comboType,
		price,
		discountPercentage,
		isActive,
		validUntil,
		order,
		resourceId,
		items,
		groups,
		paramsToForget
	}: CreateComboServiceRequest) {
		const data: Prisma.ComboCreateInput = {
			name,
			slug: slugify(name),
			description,
			combo_type: comboType,
			price: transformPriceToDatabase(price),
			discount_percentage: discountPercentage,
			is_active: isActive,
			valid_until: validUntil,
			order,
			establishment: { connect: { id: establishmentId } },
			...(comboType === ComboType.FIXED && {
				items: {
					create: items.map(item => ({
						product: { connect: { id: item.productId } },
						quantity: item.quantity
					}))
				}
			}),
			...(comboType === ComboType.BUILD_YOUR_OWN && {
				groups: {
					create: groups.map(group => ({
						name: group.name,
						min_selection: group.minSelection,
						max_selection: group.maxSelection,
						display_order: group.displayOrder,
						options: {
							create: group.options.map(option => ({
								product: { connect: { id: option.productId } },
								additional_price: transformPriceToDatabase(option.additionalPrice)
							}))
						}
					}))
				}
			}),
			...(resourceId && {
				resources: { create: { resource: { connect: { id: resourceId } } } }
			})
		};

		await this.comboRepository.create(data);

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "combos",
			paramsToForget
		});
	}
}
