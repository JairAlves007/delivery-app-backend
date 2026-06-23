import { makeComboRepository } from "@/factories/repositories/make-combo-repository.js";
import { makeProductCategoryRepository } from "@/factories/repositories/make-product-category-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { makeResourceRepository } from "@/factories/repositories/make-resource-repository.js";
import { GenerateSignedUrlForUploadService } from "@/services/upload/generate-signed-url-for-upload.js";

export const makeGenerateSignedUrlForUploadService = () => {
  const resourceRepository = makeResourceRepository();
  const productRepository = makeProductRepository();
  const productCategoryRepository = makeProductCategoryRepository();
  const comboRepository = makeComboRepository();

  return new GenerateSignedUrlForUploadService(
    resourceRepository,
    productRepository,
    productCategoryRepository,
    comboRepository,
  );
};
