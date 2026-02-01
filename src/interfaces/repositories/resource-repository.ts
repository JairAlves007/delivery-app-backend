import type { Prisma, Resource } from "@/generated/prisma/client.ts";
import type {
	ResourceRuleFromRepository,
	ValidateResourceRuleParams
} from "@/types/resource-rule.ts";

export interface IResourceRepository {
	validateResourceRule(
		params: ValidateResourceRuleParams
	): Promise<ResourceRuleFromRepository | null>;
	storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource>;
}
