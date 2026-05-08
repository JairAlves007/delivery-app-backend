import { RoleType } from "@/generated/prisma/client.js";
import type {
	AddFavoriteParams,
	FavoriteIdentifier,
	IFavoriteRepository,
	ListFavoritesParams
} from "@/interfaces/repositories/favorite-repository.js";
import prisma from "@/lib/prisma.js";
import type { ProductFromRepository } from "@/types/product.js";

export class FavoritePrismaRepository implements IFavoriteRepository {
	async add({
		userId,
		productId,
		establishmentId
	}: AddFavoriteParams): Promise<boolean> {
		const product = await prisma.product.findFirst({
			where: {
				id: productId,
				establishment_id: establishmentId,
				deleted_at: null
			},
			select: { id: true }
		});

		if (!product) return false;

		const result = await prisma.favorite.createMany({
			data: [{ user_id: userId, product_id: productId }],
			skipDuplicates: true
		});

		return result.count > 0;
	}

	async remove({ userId, productId }: FavoriteIdentifier): Promise<boolean> {
		const result = await prisma.favorite.deleteMany({
			where: { user_id: userId, product_id: productId }
		});

		return result.count > 0;
	}

	async listProducts({
		userId,
		establishmentId,
		limit,
		cursor
	}: ListFavoritesParams): Promise<ProductFromRepository[]> {
		const favorites = await prisma.favorite.findMany({
			where: {
				user_id: userId,
				product: {
					establishment_id: establishmentId,
					deleted_at: null
				}
			},
			include: {
				product: {
					include: {
						resources: { select: { resource: true } },
						tags: { select: { tag: true } }
					}
				}
			},
			orderBy: { product_id: "desc" },
			take: limit + 1,
			skip: cursor ? 1 : 0,
			cursor: cursor
				? { uq_favorites_user_product: { user_id: userId, product_id: cursor } }
				: undefined
		});

		return favorites.map(favorite => favorite.product);
	}

	async isProductFavorited({
		userId,
		productId
	}: FavoriteIdentifier): Promise<boolean> {
		const favorite = await prisma.favorite.findFirst({
			where: {
				product_id: productId,
				user_id: userId,
				user: { role: { name: RoleType.CUSTOMER } }
			},
			select: { product_id: true }
		});

		return favorite !== null;
	}
}
