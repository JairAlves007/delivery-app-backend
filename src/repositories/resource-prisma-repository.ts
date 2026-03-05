import type { Prisma, Resource } from "@/generated/prisma/client.ts";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
import prisma from "@/lib/prisma.ts";
import type {
	ResourceRuleFromRepository,
	UploadResourceRulesParams,
	ValidateResourceRuleParams
} from "@/types/resource-rule.ts";

export class ResourcePrismaRepository implements IResourceRepository {
	async validateResourceRule({
		establishmentId,
		resourceIntent: { type, for: forResource }
	}: ValidateResourceRuleParams): Promise<ResourceRuleFromRepository | null> {
		return await prisma.resourceRule.findUnique({
			where: {
				establishment_id_type_for: {
					establishment_id: establishmentId,
					type,
					for: forResource
				}
			},
			include: {
				availableFormats: true
			}
		});
	}

	async getUploadResourceRules({
		establishmentId,
		forObject
	}: UploadResourceRulesParams): Promise<ResourceRuleFromRepository[]> {
		return await prisma.resourceRule.findMany({
			where: {
				establishment_id: establishmentId,
				for: forObject
			},
			include: {
				availableFormats: true
			}
		});
	}

	async storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource> {
		return await prisma.resource.upsert(data);
	}
}
