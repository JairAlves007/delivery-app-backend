import { ProductNotFound } from "@/errors/product/not-found-error.ts";
import { ProductOutOfStockError } from "@/errors/product/out-of-stock-error.ts";
import { makeFindProductService } from "@/factories/services/product/make-find-product-service.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { ProductFromRepository } from "@/types/product.ts";

type ValidateProductFromOrderServiceRequest = {
	establishmentId: EstablishmentID;
	productQuantity: number;
	productId: string;
};

export class ValidateProductFromOrderService {
	async handle({
		establishmentId,
		productId,
		productQuantity
	}: ValidateProductFromOrderServiceRequest): Promise<ProductFromRepository> {
		const filterParams = { establishment_id: establishmentId };
		const findProductService = makeFindProductService();

		const product = await findProductService.handle({
			id: productId,
			filterParams
		});

		if (!product || (product.valid_until && product.valid_until < new Date()))
			throw new ProductNotFound();

		if (product.stock && product.stock < productQuantity)
			throw new ProductOutOfStockError();

		return product;
	}
}
