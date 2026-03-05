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
		establishmentId,
		forObject
	}: UploadResourceRulesParams): Promise<ResourceRuleFromRepository[]> {
		try {
			const cache = makeCache();
			const key = `${cache.keys.resourceRules}_${forObject}_${establishmentId}`;

			return await cache.rememberForever(
				key,
				async () =>
					await this.resourceRepository.getUploadResourceRules({
						establishmentId,
						forObject
					})
			);
		} catch (error) {
			throw error;
		}
	}
}
