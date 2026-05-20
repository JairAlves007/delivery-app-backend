import { AddonCategoryRequiredError } from "@/errors/addon/category-required-error.js";
import { AddonNotFound } from "@/errors/addon/not-found-error.js";
import { makeProductAddonCategoryRepository } from "@/factories/repositories/make-product-addon-category-repository.js";
import { makeFindAddonService } from "@/factories/services/addon/make-find-addon-service.js";
import { makeValidateAddonCategoriesFromOrderService } from "@/factories/services/order/validations/make-validate-addon-categories-from-order-service.js";
import { AddonType } from "@/generated/prisma/client.js";
import { removeDuplicateItems } from "@/helpers/utils.js";
import { calculateAddonPricing } from "@/services/order/pricing/calculate-addon-pricing.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type {
  OrderAddonsToProcess,
  OrderCategoryAddons,
} from "@/types/order.js";

type ValidateAddonsFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  productId: string;
  orderAddons?: OrderCategoryAddons[] | null;
};

type ValidateAddonsFromOrderServiceResponse = {
  addons: OrderAddonsToProcess[];
  addonsSubtotalCents: number;
};

export class ValidateAddonsFromOrderService {
  async handle({
    establishmentId,
    productId,
    orderAddons,
  }: ValidateAddonsFromOrderServiceRequest): Promise<ValidateAddonsFromOrderServiceResponse> {
    const addons: OrderAddonsToProcess[] = [];
    let addonsSubtotalCents = 0;

    const productAddonCategoryRepository =
      makeProductAddonCategoryRepository();

    const requiredCategories =
      await productAddonCategoryRepository.findRequiredByProductId(productId);

    const providedCategoryIds = new Set(
      (orderAddons ?? []).map((c) => c.id),
    );

    for (const req of requiredCategories) {
      if (!providedCategoryIds.has(req.addon_category_id)) {
        throw new AddonCategoryRequiredError();
      }
    }

    if (!orderAddons || orderAddons.length <= 0)
      return { addons, addonsSubtotalCents };

    const findAddonService = makeFindAddonService();
    const validateAddonCategoriesService =
      makeValidateAddonCategoriesFromOrderService();

    const categoryAddonsValidated = removeDuplicateItems(orderAddons);

    for (const category of categoryAddonsValidated) {
      const { junction, orderAddonsValidated } =
        await validateAddonCategoriesService.handle({
          establishmentId,
          productId,
          categoryId: category.id,
          orderAddons: category.addons,
        });

      const collectedForPricing: { priceCents: number; quantity: number }[] =
        [];

      for (const addon of orderAddonsValidated) {
        if (
          !junction.addonCategory.addons.some(
            (addonFromCategory) => addonFromCategory.id === addon.id,
          )
        )
          throw new AddonNotFound();

        const addonItem = await findAddonService.handle({ id: addon.id });

        const quantity = this.coerceQuantity(
          junction.addonCategory.type,
          addon.quantity,
        );

        addons.push({
          ...addonItem,
          quantity,
          price: addonItem.price,
        });

        collectedForPricing.push({
          priceCents: addonItem.price,
          quantity,
        });
      }

      addonsSubtotalCents += calculateAddonPricing({
        pricingStrategy: junction.addonCategory.pricing_strategy,
        type: junction.addonCategory.type,
        partsCount: junction.addonCategory.parts_count,
        addons: collectedForPricing,
      });
    }

    return { addons, addonsSubtotalCents };
  }

  private coerceQuantity(type: AddonType, quantity: number): number {
    if (type === AddonType.SINGLE_CHOICE || type === AddonType.MULTIPLE_CHOICE)
      return 1;
    return quantity;
  }
}
