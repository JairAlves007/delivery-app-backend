import z from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import { transformPriceToDatabase } from "@/helpers/price.js";
import { slugify } from "@/helpers/utils.js";
import type { IComboRepository } from "@/interfaces/repositories/combo-repository.js";
import { forgetAllListingCacheKeysQueue } from "@/queues/cache-queue.js";
import { updateComboBodySchema } from "@/schemas/combo-schema.js";
import type { ForgetAllListingCacheKeysParams } from "@/types/cache.js";
import type { EstablishmentID } from "@/types/establishment.js";

interface UpdateComboServiceRequest
	extends
		z.infer<typeof updateComboBodySchema>,
		Pick<ForgetAllListingCacheKeysParams, "paramsToForget"> {
	id: string;
	establishmentId: EstablishmentID;
}

export class UpdateComboService {
	private comboRepository: IComboRepository;

	constructor(comboRepository: IComboRepository) {
		this.comboRepository = comboRepository;
	}

	async handle({
		id,
		establishmentId,
		name,
		comboType,
		price,
		discountPercentage,
		isActive,
		validUntil,
		order,
		resourceId,
		items,
		groups,
		paramsToForget,
		...rest
	}: UpdateComboServiceRequest) {
		const data: Prisma.ComboUpdateInput = {
			...rest,
			...(name !== undefined && { name, slug: slugify(name) }),
			...(comboType !== undefined && { combo_type: comboType }),
			...(price !== undefined && { price: transformPriceToDatabase(price) }),
			...(discountPercentage !== undefined && {
				discount_percentage: discountPercentage
			}),
			...(isActive !== undefined && { is_active: isActive }),
			...(validUntil !== undefined && { valid_until: validUntil }),
			...(order !== undefined && { order }),
			...(items !== undefined && {
				items: {
					deleteMany: {},
					create: items.map(item => ({
						product: { connect: { id: item.productId } },
						quantity: item.quantity
					}))
				}
			}),
			...(groups !== undefined && {
				groups: {
					deleteMany: {},
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
			...(resourceId !== undefined && {
				resources: {
					deleteMany: {},
					...(resourceId && {
						create: { resource: { connect: { id: resourceId } } }
					})
				}
			})
		};

		await this.comboRepository.update({
			id,
			filterParams: { establishment_id: establishmentId },
			data
		});

		await forgetAllListingCacheKeysQueue({
			baseCacheKey: "combos",
			paramsToForget
		});
	}
}
