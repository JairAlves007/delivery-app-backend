import type { Prisma } from "@prisma/client";
import type { EstablishmentID } from "./establishment.ts";
import type { ResourceIntent } from "./resource.ts";

export type ValidateResourceRuleParams = {
	establishmentId: EstablishmentID;
	resourceIntent: ResourceIntent;
};

export type ResourceRuleFromRepository = Prisma.ResourceRuleGetPayload<{
	include: {
		availableFormats: true;
	};
}>;
