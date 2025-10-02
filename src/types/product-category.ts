import type { Prisma } from "@prisma/client";
import type { ResourceItem } from "./resource.ts";

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
