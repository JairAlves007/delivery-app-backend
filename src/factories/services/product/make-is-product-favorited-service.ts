import { makeFavoriteRepository } from "@/factories/repositories/make-favorite-repository.js";
import { IsProductFavoritedService } from "@/services/product/is-product-favorited-service.js";

export const makeIsProductFavoritedService = () => {
	const favoriteRepository = makeFavoriteRepository();
	return new IsProductFavoritedService(favoriteRepository);
};
