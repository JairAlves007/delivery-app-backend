import { establishmentIdSchema } from "@/schemas/generic-schema.ts";
import type { Prisma } from "@prisma/client";
import z from "zod";
import type { FilterParams } from "./crud.ts";
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

export type EstablishmentsList = Omit<
	EstablishmentFromRepository,
	"resources"
> & {
	resources: ResourceItem;
};

export type CreateMenuForNewEstablishmentEventType = {
	establishmentId: EstablishmentID;
	paramsToForget?: FilterParams;
};

export type EstablishmentID = z.infer<typeof establishmentIdSchema>;
