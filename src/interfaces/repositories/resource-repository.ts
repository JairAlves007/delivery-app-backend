import type {
	ResourceRuleFromRepository,
	ValidateResourceRuleParams
} from "@/types/resource-rule.ts";
import type { Prisma, Resource } from "@prisma/client";

export interface IResourceRepository {
	validateResourceRule(
		params: ValidateResourceRuleParams
	): Promise<ResourceRuleFromRepository | null>;
	storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource>;
}
