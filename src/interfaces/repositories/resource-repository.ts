import type { ResourceIntent } from "@/types/resource.ts";
import type { Prisma, ResourceType } from "@prisma/client";

export interface IResourceRepository {
	validateResourceRule(resourceIntent: ResourceIntent): Promise<boolean>;
}
