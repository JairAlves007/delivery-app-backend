import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { updateAddonCategoryBodySchema } from "@/schemas/addon-category-schema.ts";
import z from "zod";

type UpdateAddonCategoryServiceRequest = z.infer<
	typeof updateAddonCategoryBodySchema
>;

export class UpdateAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle(
		id: number,
		{
			establishmentId,
			addonIds,
			maxQuantity: max_quantity,
			...data
		}: UpdateAddonCategoryServiceRequest
	) {
		const addons = !!addonIds
			? {
					set: addonIds.map(addonId => ({
						id: addonId
					}))
			  }
			: undefined;

		return await this.addonCategoryRepository.update(id, {
			...data,
			max_quantity,
			establishment: {
				connect: {
					id: establishmentId
				}
			},
			addons
		});
	}
}
