import type { EstablishmentID } from "@/types/establishment.js";
import type { ProductFromRepository } from "@/types/product.js";
import type { UserID } from "@/types/user.js";

export type FavoriteIdentifier = {
	userId: UserID;
	productId: string;
};

export type AddFavoriteParams = FavoriteIdentifier & {
	establishmentId: EstablishmentID;
};

export type ListFavoritesParams = {
	userId: UserID;
	establishmentId: EstablishmentID;
	limit: number;
	cursor?: string | null;
};

export interface IFavoriteRepository {
	add(params: AddFavoriteParams): Promise<boolean>;
	remove(params: FavoriteIdentifier): Promise<boolean>;
	listProducts(params: ListFavoritesParams): Promise<ProductFromRepository[]>;
}
