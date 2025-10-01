import type { ResourceIntent } from "@/types/resource.ts";
import type { ForObjectResourceType, Prisma, Resource } from "@prisma/client";

export interface IResourceRepository {
	validateResourceRule(
		forResource: ForObjectResourceType,
		resourceIntent: ResourceIntent
	): Promise<boolean>;
	storeResource(data: Prisma.ResourceCreateInput): Promise<Resource>;
}
