import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.ts";
import { AddonQuantityExceeded } from "@/errors/addon/quantity-exceeded-error.ts";
import { makeFindAddonCategoryService } from "@/factories/services/addon/category/make-find-addon-category-service.ts";
import { makeCache } from "@/factories/services/cache/make-cache.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import { removeDuplicateItems } from "@/helpers/utils.ts";
import type { AddonCategoryFromRepository } from "@/types/addon-category.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { OrderAddons } from "@/types/order.ts";

type ValidateAddonCategoriesFromOrderServiceRequest = {
	establishmentId: EstablishmentID;
	categoryId: number;
	orderAddons: OrderAddons[];
};

type ValidateAddonCategoriesFromOrderServiceResponse = {
	addonCategory: AddonCategoryFromRepository;
	orderAddonsValidated: OrderAddons[];
};

export class ValidateAddonCategoriesFromOrderService {
	async handle({
		establishmentId,
		categoryId,
		orderAddons
	}: ValidateAddonCategoriesFromOrderServiceRequest): Promise<ValidateAddonCategoriesFromOrderServiceResponse> {
		const cache = makeCache();
		const filterParams = { establishment_id: establishmentId };
		const prefixKey = getFilterParamsCacheKey(filterParams);

		const findAddonCategory = makeFindAddonCategoryService();

		const addonCategory = await cache.rememberForever(
			`${prefixKey}${cache.keys.addonCategories}_${categoryId}`,
			async () =>
				await findAddonCategory.handle({ id: categoryId, filterParams })
		);

		if (!addonCategory) throw new AddonCategoryNotFound();

		const orderAddonsValidated = removeDuplicateItems(orderAddons);

		if (!!addonCategory.max_quantity) {
			const quantity = orderAddonsValidated.reduce((acc, addon) => {
				return (acc += addon.quantity);
			}, 0);

			if (quantity > addonCategory.max_quantity)
				throw new AddonQuantityExceeded();
		}

		return { addonCategory, orderAddonsValidated };
	}
}
