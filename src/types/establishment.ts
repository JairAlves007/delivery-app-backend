import { Prisma } from "@prisma/client";

export type EstablishmentWithInfo = Prisma.EstablishmentGetPayload<{
	include: {
		socialLinks: true;
		openingHours: true;
		closures: true;
	};
}>;

export type EstablishmentCatalog = Prisma.ProductGetPayload<{}>;
