import type { Prisma } from "@prisma/client";
import type { ResourceItem } from "./resource.ts";

export type EstablishmentFromRepository = Prisma.EstablishmentGetPayload<{
	include: {
		resources: {
			select: {
				resource: true;
			};
		};
		socialLinks: true;
		openingHours: true;
		closures: true;
	};
}>;

export type EstablishmentCatalog = Prisma.ProductGetPayload<{}>;

export type EstablishmentsList = Omit<
	EstablishmentFromRepository,
	"resources"
> & {
	resources: ResourceItem;
};
