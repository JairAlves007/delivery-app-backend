import { makeFavoriteRepository } from "@/factories/repositories/make-favorite-repository.js";
import { ListMyFavoritesService } from "@/services/favorite/list-my-favorites-service.js";

export const makeListMyFavoritesService = () => {
  return new ListMyFavoritesService(makeFavoriteRepository());
};
