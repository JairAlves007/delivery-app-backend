import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
import type {
	ResourceRuleFromRepository,
	ValidateResourceRuleParams
} from "@/types/resource-rule.ts";
import type { Prisma, Resource } from "@prisma/client";
import { prisma } from "@/lib/prisma.ts";

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

	async storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource> {
		return await prisma.resource.upsert(data);
	}
}
