import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
import type {
	ResourceRuleFromRepository,
	UploadResourceRulesParams
} from "@/types/resource-rule.ts";

export class GetUploadResourceRulesService {
	private resourceRepository: IResourceRepository;

	constructor(resourceRepository: IResourceRepository) {
		this.resourceRepository = resourceRepository;
	}

	async handle({
		forObject
	}: UploadResourceRulesParams): Promise<ResourceRuleFromRepository[]> {
		try {
			const cache = makeCache();
			const key = `${cache.keys.resourceRules}_${forObject}`;

			return await cache.rememberForever(
				key,
				async () =>
					await this.resourceRepository.getUploadResourceRules({
						forObject
					})
			);
		} catch (error) {
			throw error;
		}
	}
}
