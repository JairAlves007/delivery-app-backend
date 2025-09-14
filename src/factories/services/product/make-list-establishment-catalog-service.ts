import { makeProductRepository } from "@/factories/repositories/make-product-repository.ts";
import { ListEstablishmentCatalogService } from "@/services/product/list-establishment-catalog-service.ts";

export const makeListEstablishmentCatalogService = () => {
	const productRepository = makeProductRepository();
	return new ListEstablishmentCatalogService(productRepository);
};
