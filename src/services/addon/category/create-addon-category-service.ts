import type { IAddonCategoryRepository } from "@/interfaces/repositories/addon-category-repository.ts";
import { createAddonCategoryBodySchema } from "@/schemas/addon-category-schema.ts";
import z from "zod";

type CreateAddonCategoryServiceRequest = z.infer<
	typeof createAddonCategoryBodySchema
>;

export class CreateAddonCategoryService {
	private addonCategoryRepository: IAddonCategoryRepository;

	constructor(addonCategoryRepository: IAddonCategoryRepository) {
		this.addonCategoryRepository = addonCategoryRepository;
	}

	async handle({
		establishmentId,
		maxQuantity: max_quantity,
		...data
	}: CreateAddonCategoryServiceRequest) {
		return await this.addonCategoryRepository.create({
			...data,
			max_quantity,
			status: true,
			establishment: {
				connect: {
					id: establishmentId
				}
			}
		});
	}
}
