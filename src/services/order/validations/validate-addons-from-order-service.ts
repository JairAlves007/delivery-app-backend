import type { EstablishmentID } from "@/types/establishment.ts";
import type {
	OrderAddonsToProcess,
	OrderCategoryAddons
} from "@/types/order.ts";
import { AddonNotFound } from "@/errors/addon/not-found-error.ts";
import { makeFindAddonService } from "@/factories/services/addon/make-find-addon-service.ts";
import { makeValidateAddonCategoriesFromOrderService } from "@/factories/services/order/validations/make-validate-addon-categories-from-order-service.ts";
import { transformPriceFromDatabase } from "@/helpers/price.ts";
import { removeDuplicateItems } from "@/helpers/utils.ts";
import { AddonType } from "@prisma/client";

type ValidateAddonsFromOrderServiceRequest = {
	establishmentId: EstablishmentID;
	orderAddons?: OrderCategoryAddons[] | null;
};

export class ValidateAddonsFromOrderService {
	async handle({
		establishmentId,
		orderAddons
	}: ValidateAddonsFromOrderServiceRequest): Promise<OrderAddonsToProcess[]> {
		const addons: OrderAddonsToProcess[] = [];

		if (!!!orderAddons || orderAddons.length <= 0) return addons;

		const findAddonService = makeFindAddonService();
		const validateAddonCategoriesService =
			makeValidateAddonCategoriesFromOrderService();

		const categoryAddonsValidated = removeDuplicateItems(orderAddons);

		for (const category of categoryAddonsValidated) {
			const { addonCategory, orderAddonsValidated } =
				await validateAddonCategoriesService.handle({
					establishmentId,
					categoryId: category.id,
					orderAddons: category.addons
				});

			for (const addon of orderAddonsValidated) {
				if (
					!addonCategory.addons.some(
						addonFromCategory => addonFromCategory.id === addon.id
					)
				)
					throw new AddonNotFound();

				const addonItem = await findAddonService.handle({ id: addon.id });

				addons.push({
					...addonItem,
					quantity:
						addonCategory.type === AddonType.MULTIPLE_CHOICE
							? 1
							: addon.quantity,
					price: transformPriceFromDatabase(addonItem.price)
				});
			}
		}

		return addons;
	}
}
