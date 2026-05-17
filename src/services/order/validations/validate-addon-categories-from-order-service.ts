import { AddonCategoryNotFound } from "@/errors/addon/category/not-found-error.js";
import { AddonCategoryNotLinkedToProductError } from "@/errors/addon/category-not-linked-to-product-error.js";
import { AddonCategoryRequiredError } from "@/errors/addon/category-required-error.js";
import { FractionalPartsExceededError } from "@/errors/addon/fractional-parts-exceeded-error.js";
import { AddonQuantityExceeded } from "@/errors/addon/quantity-exceeded-error.js";
import { AddonSelectionBelowMinimumError } from "@/errors/addon/selection-below-minimum-error.js";
import { SingleChoiceOnlyOneAllowedError } from "@/errors/addon/single-choice-only-one-allowed-error.js";
import { makeProductAddonCategoryRepository } from "@/factories/repositories/make-product-addon-category-repository.js";
import { AddonType } from "@/generated/prisma/client.js";
import { removeDuplicateItems } from "@/helpers/utils.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { OrderAddons } from "@/types/order.js";
import type { ProductAddonCategoryWithProductFromRepository } from "@/types/product-addon-category.js";

type ValidateAddonCategoriesFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  productId: string;
  categoryId: number;
  orderAddons: OrderAddons[];
};

type ValidateAddonCategoriesFromOrderServiceResponse = {
  junction: ProductAddonCategoryWithProductFromRepository;
  orderAddonsValidated: OrderAddons[];
};

export class ValidateAddonCategoriesFromOrderService {
  async handle({
    establishmentId,
    productId,
    categoryId,
    orderAddons,
  }: ValidateAddonCategoriesFromOrderServiceRequest): Promise<ValidateAddonCategoriesFromOrderServiceResponse> {
    const productAddonCategoryRepository =
      makeProductAddonCategoryRepository();

    const junction =
      await productAddonCategoryRepository.findByProductAndCategory({
        productId,
        addonCategoryId: categoryId,
      });

    if (!junction) throw new AddonCategoryNotLinkedToProductError();

    if (junction.product.establishment_id !== establishmentId)
      throw new AddonCategoryNotFound();

    const orderAddonsValidated = removeDuplicateItems(orderAddons);

    const totalCount = this.computeTotal(
      junction.addonCategory.type,
      orderAddonsValidated,
    );

    if (
      junction.addonCategory.type === AddonType.SINGLE_CHOICE &&
      totalCount > 1
    ) {
      throw new SingleChoiceOnlyOneAllowedError();
    }

    if (
      junction.addonCategory.type === AddonType.FRACTIONAL &&
      junction.addonCategory.parts_count != null &&
      totalCount > junction.addonCategory.parts_count
    ) {
      throw new FractionalPartsExceededError();
    }

    if (
      junction.min_selection != null &&
      totalCount < junction.min_selection
    ) {
      throw new AddonSelectionBelowMinimumError();
    }

    if (
      junction.max_selection != null &&
      totalCount > junction.max_selection
    ) {
      throw new AddonQuantityExceeded();
    }

    if (junction.is_required && totalCount === 0) {
      throw new AddonCategoryRequiredError(junction.addonCategory.name);
    }

    return { junction, orderAddonsValidated };
  }

  private computeTotal(type: AddonType, addons: OrderAddons[]): number {
    if (type === AddonType.QUANTITY || type === AddonType.FRACTIONAL) {
      return addons.reduce((acc, a) => acc + a.quantity, 0);
    }
    return addons.length;
  }
}
