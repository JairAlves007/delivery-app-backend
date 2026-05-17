import { makeAddonCategoryRepository } from "@/factories/repositories/make-addon-category-repository.js";
import { makeProductAddonCategoryRepository } from "@/factories/repositories/make-product-addon-category-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { AttachProductAddonCategoryService } from "@/services/product-addon-category/attach-product-addon-category-service.js";

export const makeAttachProductAddonCategoryService = () => {
  const productRepository = makeProductRepository();
  const addonCategoryRepository = makeAddonCategoryRepository();
  const productAddonCategoryRepository = makeProductAddonCategoryRepository();
  return new AttachProductAddonCategoryService(
    productRepository,
    addonCategoryRepository,
    productAddonCategoryRepository,
  );
};
