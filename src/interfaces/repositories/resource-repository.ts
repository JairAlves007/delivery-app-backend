import type { ResourceIntent } from "@/types/resource.ts";

export interface IResourceRepository {
	validateResourceRule(
		resourceIntent: ResourceIntent
	): Promise<{ path: string }>;
}
