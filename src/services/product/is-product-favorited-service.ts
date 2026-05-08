import type { IFavoriteRepository } from "@/interfaces/repositories/favorite-repository.js";
import type { UserID } from "@/types/user.js";

type IsProductFavoritedServiceRequest = {
  userId: UserID;
  productId: string;
};

export class IsProductFavoritedService {
  private favoriteRepository: IFavoriteRepository;

  constructor(favoriteRepository: IFavoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  public async handle({
    userId,
    productId,
  }: IsProductFavoritedServiceRequest): Promise<boolean> {
    return await this.favoriteRepository.isProductFavorited({
      userId,
      productId,
    });
  }
}
