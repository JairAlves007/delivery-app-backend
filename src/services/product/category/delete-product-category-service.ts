import type { IProductCategoryRepository } from "@/interfaces/repositories/product-category-repository.ts";

export class DeleteProductCategoryService {
	private productCategoryRepository: IProductCategoryRepository;

	constructor(productCategoryRepository: IProductCategoryRepository) {
		this.productCategoryRepository = productCategoryRepository;
	}

	async handle(id: string) {
		return await this.productCategoryRepository.delete(id, false);
	}
}
