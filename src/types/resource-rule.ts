import type { Prisma } from "@prisma/client";
import type { ResourceIntent } from "./resource.ts";
import type { EstablishmentID } from "./establishment.ts";

export type ValidateResourceRuleParams = {
	establishmentId: EstablishmentID;
	resourceIntent: ResourceIntent;
};

export type ResourceRuleFromRepository = Prisma.ResourceRuleGetPayload<{
	include: {
		availableFormats: true;
	};
}>;
