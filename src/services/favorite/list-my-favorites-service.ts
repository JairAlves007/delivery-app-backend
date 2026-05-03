import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import type { IFavoriteRepository } from "@/interfaces/repositories/favorite-repository.js";
import { mapProducts } from "@/services/product/map-product.js";
import type { CursorPaginatedResponse } from "@/types/crud.js";
import type { ProductList } from "@/types/product.js";

type ListMyFavoritesServiceRequest = {
  userId: string;
  establishmentId: string;
  limit: number;
  cursor?: string | null;
};

export class ListMyFavoritesService {
  private favoriteRepository: IFavoriteRepository;

  constructor(favoriteRepository: IFavoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async handle({
    userId,
    establishmentId,
    limit,
    cursor,
  }: ListMyFavoritesServiceRequest): Promise<
    CursorPaginatedResponse<ProductList>
  > {
    const cache = makeCache();
    const cursorSuffix = cursor ? `_cursor_${cursor}` : "";
    const key = `${cache.keys.favorites}_user_${userId}_${establishmentId}_limit_${limit}${cursorSuffix}`;

    const raw = await cache.remember(
      key,
      Constants.CACHE_TTL.favorites,
      async () =>
        await this.favoriteRepository.listProducts({
          userId,
          establishmentId,
          limit,
          cursor,
        }),
    );

    const hasNextPage = raw.length > limit;
    const products = hasNextPage ? raw.slice(0, limit) : raw;
    const nextCursor = hasNextPage ? products[products.length - 1].id : null;

    if (products.length <= 0) await cache.forget(key);

    return {
      items: mapProducts(products),
      pagination: {
        nextCursor,
        hasNextPage: !!nextCursor,
      },
    };
  }
}
