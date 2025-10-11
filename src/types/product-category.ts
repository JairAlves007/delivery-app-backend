import type { Prisma } from "@prisma/client";
import type { ResourceItem } from "./resource.ts";
import type { ProductList } from "./product.ts";
import { CursorPaginationParams } from "./crud.ts";

export type ProductCategoryFromRepository = Prisma.ProductCategoryGetPayload<{
	include: {
		resources: {
			select: {
				resource: true;
			};
		};
	};
}>;

export type ProductCategoryList = Omit<
	ProductCategoryFromRepository,
	"resources"
> & {
	resources: ResourceItem;
};
