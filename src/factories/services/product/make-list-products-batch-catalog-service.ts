import { makeProductAddonCategoryRepository } from "@/factories/repositories/make-product-addon-category-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { ListProductsBatchCatalogService } from "@/services/product/list-products-batch-catalog-service.js";

export const makeListProductsBatchCatalogService = () => {
  const productRepository = makeProductRepository();
  const productAddonCategoryRepository = makeProductAddonCategoryRepository();
  return new ListProductsBatchCatalogService(
    productRepository,
    productAddonCategoryRepository,
  );
};
