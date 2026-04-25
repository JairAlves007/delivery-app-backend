import type { Prisma, Resource } from "@/generated/prisma/client.js";
import type {
  ResourceRuleFromRepository,
  UploadResourceRulesParams,
  ValidateResourceRuleParams,
} from "@/types/resource-rule.js";

export interface IResourceRepository {
  validateResourceRule(
    params: ValidateResourceRuleParams,
  ): Promise<ResourceRuleFromRepository | null>;
  getUploadResourceRules(
    params: UploadResourceRulesParams,
  ): Promise<ResourceRuleFromRepository[]>;
  storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource>;
}
