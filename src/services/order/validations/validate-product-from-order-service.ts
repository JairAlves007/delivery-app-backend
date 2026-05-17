import { ProductNotFound } from "@/errors/product/not-found-error.js";
import { ProductOutOfStockError } from "@/errors/product/out-of-stock-error.js";
import { ProductQuantityNotAllowedForWeightedError } from "@/errors/product/quantity-not-allowed-for-weighted-error.js";
import { ProductWeightNotAllowedError } from "@/errors/product/weight-not-allowed-error.js";
import { ProductWeightRequiredError } from "@/errors/product/weight-required-error.js";
import { makeFindProductService } from "@/factories/services/product/make-find-product-service.js";
import { ProductPricingMode } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { ProductList } from "@/types/product.js";

type ValidateProductFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  productQuantity: number;
  productId: string;
  weightGrams?: number | null;
};

export class ValidateProductFromOrderService {
  async handle({
    establishmentId,
    productId,
    productQuantity,
    weightGrams,
  }: ValidateProductFromOrderServiceRequest): Promise<ProductList> {
    const filterParams = { establishment_id: establishmentId };
    const findProductService = makeFindProductService();

    const product = await findProductService.handle({
      id: productId,
      filterParams,
    });

    if (!product || (product.valid_until && product.valid_until < new Date()))
      throw new ProductNotFound();

    if (product.pricing_mode === ProductPricingMode.PER_WEIGHT) {
      if (weightGrams == null || weightGrams <= 0)
        throw new ProductWeightRequiredError();
      if (productQuantity !== 1)
        throw new ProductQuantityNotAllowedForWeightedError();
      if (product.stock != null && product.stock < weightGrams)
        throw new ProductOutOfStockError();
    } else {
      if (weightGrams != null) throw new ProductWeightNotAllowedError();
      if (product.stock != null && product.stock < productQuantity)
        throw new ProductOutOfStockError();
    }

    return product;
  }
}
