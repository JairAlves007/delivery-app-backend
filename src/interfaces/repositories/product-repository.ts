import type { Prisma } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";
import { ProductFromRepository } from "@/types/product.js";

import type { ICRUDBase } from "../crud-base.js";
import { CursorPagination } from "../cursor-pagination.js";

export type SearchCatalogParams = {
	establishmentId: EstablishmentID;
	categoryId?: string | null;
	search: string;
	page: number;
	perPage: number;
	similarityThreshold?: number;
};

export interface IProductRepository
	extends
		ICRUDBase<
			ProductFromRepository,
			Prisma.ProductCreateInput,
			Prisma.ProductUpdateInput,
			string
		>,
		CursorPagination<ProductFromRepository, string> {
	deleteOldTags(id: string): Promise<void>;
	deleteOldProductAddonCategories(id: string): Promise<void>;
	findSuggested(params: {
		productId: string;
		establishmentId: EstablishmentID;
		limit: number;
	}): Promise<ProductFromRepository[]>;
	searchCatalog(params: SearchCatalogParams): Promise<ProductFromRepository[]>;
	countSearchCatalog(
		params: Omit<SearchCatalogParams, "page" | "perPage">,
	): Promise<number>;
}
