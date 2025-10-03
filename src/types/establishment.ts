import type { Prisma } from "@prisma/client";
import type { ResourceItem } from "./resource.ts";
import z from "zod";
import { establishmentIdSchema } from "@/schemas/generic-schema.ts";

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

export type EstablishmentID = z.infer<typeof establishmentIdSchema>;
