import { makeFavoriteRepository } from "@/factories/repositories/make-favorite-repository.js";
import { RemoveFavoriteService } from "@/services/favorite/remove-favorite-service.js";

export const makeRemoveFavoriteService = () => {
  return new RemoveFavoriteService(makeFavoriteRepository());
};
