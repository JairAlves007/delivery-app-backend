import { makeCache } from "@/factories/services/cache/make-cache.js";
import type { IFavoriteRepository } from "@/interfaces/repositories/favorite-repository.js";

type RemoveFavoriteServiceRequest = {
  userId: string;
  productId: string;
  establishmentId: string;
};

export class RemoveFavoriteService {
  private favoriteRepository: IFavoriteRepository;

  constructor(favoriteRepository: IFavoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async handle({
    userId,
    productId,
    establishmentId,
  }: RemoveFavoriteServiceRequest): Promise<void> {
    await this.favoriteRepository.remove({ userId, productId });

    const cache = makeCache();
    await Promise.all([
      cache.forgetKeysContaining(
        `${cache.keys.favorites}_user_${userId}_${establishmentId}`,
      ),
      cache.forgetKeysContaining(
        `${cache.keys.dashboard}_${establishmentId}`,
      ),
    ]);
  }
}
