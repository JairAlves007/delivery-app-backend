import { mapMimeTypeToFileFormat } from "@/helpers/resource.ts";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
import type { ResourceIntent } from "@/types/resource.ts";
import type { ForObjectResourceType, Prisma, Resource } from "@prisma/client";
import { prisma } from "@/lib/prisma.ts";

export class ResourcePrismaRepository implements IResourceRepository {
	async validateResourceRule(
		forResource: ForObjectResourceType,
		resourceIntent: ResourceIntent
	): Promise<boolean> {
		const resourceRule = await prisma.resourceRule.findFirst({
			where: {
				type: resourceIntent.type,
				for: forResource,
				width: resourceIntent.width,
				height: resourceIntent.height,
				availableFormats: {
					some: {
						type: mapMimeTypeToFileFormat(resourceIntent.mimeType)
					}
				}
			}
		});

		return !!resourceRule;
	}

	async storeResource(data: Prisma.ResourceCreateInput): Promise<Resource> {
		return await prisma.resource.create({ data });
	}
}
