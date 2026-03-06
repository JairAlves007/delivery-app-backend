import type {
	ForObjectResourceType,
	Prisma
} from "@/generated/prisma/client.ts";
import type { ResourceIntent } from "./resource.ts";

export type ValidateResourceRuleParams = {
	resourceIntent: ResourceIntent;
};

export type UploadResourceRulesParams = {
	forObject: ForObjectResourceType;
};

export type ResourceRuleFromRepository = Prisma.ResourceRuleGetPayload<{
	include: {
		availableFormats: true;
	};
}>;
