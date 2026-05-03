import type { ProductFromRepository } from "@/types/product.js";

export type FavoriteIdentifier = {
  userId: string;
  productId: string;
};

export type AddFavoriteParams = FavoriteIdentifier & {
  establishmentId: string;
};

export type ListFavoritesParams = {
  userId: string;
  establishmentId: string;
  limit: number;
  cursor?: string | null;
};

export interface IFavoriteRepository {
  add(params: AddFavoriteParams): Promise<boolean>;
  remove(params: FavoriteIdentifier): Promise<boolean>;
  listProducts(params: ListFavoritesParams): Promise<ProductFromRepository[]>;
}
