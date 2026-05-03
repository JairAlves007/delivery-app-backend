import { FavoritePrismaRepository } from "@/repositories/favorite-prisma-repository.js";

export const makeFavoriteRepository = () => {
  return new FavoritePrismaRepository();
};
