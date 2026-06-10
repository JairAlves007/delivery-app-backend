import { makeCache } from "@/factories/services/cache/make-cache.js";
import Constants from "@/helpers/constants.js";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.js";
import type {
  ResourceRuleFromRepository,
  UploadResourceRulesParams,
} from "@/types/resource-rule.js";

export class GetUploadResourceRulesService {
  private resourceRepository: IResourceRepository;

  constructor(resourceRepository: IResourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async handle({
    forObject,
  }: UploadResourceRulesParams): Promise<ResourceRuleFromRepository[]> {
    const cache = makeCache();
    const key = `${cache.keys.resourceRules}_${forObject}`;

    return await cache.remember(
      key,
      Constants.CACHE_TTL.resourceRules,
      async () =>
        await this.resourceRepository.getUploadResourceRules({
          forObject,
        }),
      { domain: "resourceRules" },
    );
  }
}
