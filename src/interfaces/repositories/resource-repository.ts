import type { Prisma, Resource } from "@/generated/prisma/client.ts";
import type {
	ResourceRuleFromRepository,
	UploadResourceRulesParams,
	ValidateResourceRuleParams
} from "@/types/resource-rule.ts";

export interface IResourceRepository {
	validateResourceRule(
		params: ValidateResourceRuleParams
	): Promise<ResourceRuleFromRepository | null>;
	getUploadResourceRules(
		params: UploadResourceRulesParams
	): Promise<ResourceRuleFromRepository[]>;
	storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource>;
}
