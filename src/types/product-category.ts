import type { Prisma } from "@/generated/prisma/client.js";

import type { ResourceItem } from "./resource.js";

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
