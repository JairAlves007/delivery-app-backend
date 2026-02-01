import type { Prisma } from "@/generated/prisma/client.ts";
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
