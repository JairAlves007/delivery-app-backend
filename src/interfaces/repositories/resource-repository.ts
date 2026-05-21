import type { Prisma, Resource } from "@/generated/prisma/client.js";
import type { ResourceWithJoinCounts } from "@/types/resource.js";
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
  findByIdAndEstablishment(params: {
    resourceId: string;
    establishmentId: string;
  }): Promise<ResourceWithJoinCounts | null>;
  findResourceLocationById(params: {
    resourceId: string;
    establishmentId: string;
  }): Promise<{ path: string; file_key: string } | null>;
  deleteResource(params: { resourceId: string }): Promise<void>;
}
