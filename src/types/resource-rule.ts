import type {
	ForObjectResourceType,
	Prisma
} from "@/generated/prisma/client.ts";
import type { EstablishmentID } from "./establishment.ts";
import type { ResourceIntent } from "./resource.ts";

export type ValidateResourceRuleParams = {
	establishmentId: EstablishmentID;
	resourceIntent: ResourceIntent;
};

export type UploadResourceRulesParams = {
	establishmentId: EstablishmentID;
	forObject: ForObjectResourceType;
};

export type ResourceRuleFromRepository = Prisma.ResourceRuleGetPayload<{
	include: {
		availableFormats: true;
	};
}>;
