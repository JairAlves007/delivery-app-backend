import { mapMimeTypeToFileFormat } from "@/helpers/resource.ts";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
import type { ResourceIntent } from "@/types/resource.ts";
import type { Prisma, Resource } from "@prisma/client";
import { prisma } from "@/lib/prisma.ts";

export class ResourcePrismaRepository implements IResourceRepository {
	async validateResourceRule({
		type,
		for: forResource,
		width,
		height,
		mimeType
	}: ResourceIntent): Promise<boolean> {
		const resourceRule = await prisma.resourceRule.findFirst({
			where: {
				type: type,
				for: forResource,
				width: width,
				height: height,
				availableFormats: {
					some: {
						type: mapMimeTypeToFileFormat(mimeType)
					}
				}
			}
		});

		return !!resourceRule;
	}

	async storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource> {
		return await prisma.resource.upsert(data);
	}
}
