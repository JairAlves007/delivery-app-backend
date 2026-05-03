import { makeFavoriteRepository } from "@/factories/repositories/make-favorite-repository.js";
import { makeProductRepository } from "@/factories/repositories/make-product-repository.js";
import { AddFavoriteService } from "@/services/favorite/add-favorite-service.js";

export const makeAddFavoriteService = () => {
  return new AddFavoriteService(
    makeFavoriteRepository(),
    makeProductRepository(),
  );
};
