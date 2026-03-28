import z from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";

import type { FilterParams } from "./crud.js";
import type { ResourceItem } from "./resource.js";

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

export type CreateMenuForNewEstablishmentType = {
	establishmentId: EstablishmentID;
	paramsToForget?: FilterParams;
};

export type EstablishmentID = z.infer<typeof establishmentIdSchema>;
