import type { Prisma } from "@prisma/client";
import type { ResourceItem } from "./resource.ts";

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
