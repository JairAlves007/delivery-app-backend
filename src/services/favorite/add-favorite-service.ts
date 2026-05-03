import { ProductNotFound } from "@/errors/product/not-found-error.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { IFavoriteRepository } from "@/interfaces/repositories/favorite-repository.js";
import type { IProductRepository } from "@/interfaces/repositories/product-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { UserID } from "@/types/user.js";

type AddFavoriteServiceRequest = {
	userId: UserID;
	productId: string;
	establishmentId: EstablishmentID;
};

export class AddFavoriteService {
	private favoriteRepository: IFavoriteRepository;
	private productRepository: IProductRepository;

	constructor(
		favoriteRepository: IFavoriteRepository,
		productRepository: IProductRepository
	) {
		this.favoriteRepository = favoriteRepository;
		this.productRepository = productRepository;
	}

	async handle({
		userId,
		productId,
		establishmentId
	}: AddFavoriteServiceRequest): Promise<void> {
		const product = await this.productRepository.findById({
			id: productId,
			filterParams: { establishment_id: establishmentId }
		});

		if (!product) throw new ProductNotFound();

		await this.favoriteRepository.add({
			userId,
			productId,
			establishmentId
		});

		const cache = makeCache();
		await Promise.all([
			cache.forgetKeysContaining(
				`${cache.keys.favorites}_user_${userId}_${establishmentId}`
			),
			cache.forgetKeysContaining(`${cache.keys.dashboard}_${establishmentId}`)
		]);
	}
}
