import type { Prisma } from "@/generated/prisma/client.js";

import type { ResourceItem } from "./resource.js";

export type ProductFromRepository = Prisma.ProductGetPayload<{
	include: {
		resources: {
			select: {
				resource: true;
			};
		};
	};
}>;

export type ProductList = Omit<ProductFromRepository, "resources"> & {
	resources: ResourceItem;
};
