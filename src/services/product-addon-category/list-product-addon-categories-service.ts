import { ProductNotFound } from "@/errors/product/not-found-error.js";
import type { IProductAddonCategoryRepository } from "@/interfaces/repositories/product-addon-category-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { ProductAddonCategoryFromRepository } from "@/types/product-addon-category.js";

type ListProductAddonCategoriesServiceRequest = {
  productId: string;
  establishmentId: EstablishmentID;
};

export class ListProductAddonCategoriesService {
  constructor(
    private productRepository: IProductRepository,
    private productAddonCategoryRepository: IProductAddonCategoryRepository,
  ) {}

  async handle({
    productId,
    establishmentId,
  }: ListProductAddonCategoriesServiceRequest): Promise<
    ProductAddonCategoryFromRepository[]
  > {
    const product = await this.productRepository.findById({
      id: productId,
      filterParams: { establishment_id: establishmentId },
    });
    if (!product) throw new ProductNotFound();

    return await this.productAddonCategoryRepository.listByProductId(productId);
  }
}
