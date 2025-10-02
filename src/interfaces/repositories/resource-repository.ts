import type { ResourceIntent } from "@/types/resource.ts";
import type { Prisma, Resource } from "@prisma/client";

export interface IResourceRepository {
	validateResourceRule(resourceIntent: ResourceIntent): Promise<boolean>;
	storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource>;
}
