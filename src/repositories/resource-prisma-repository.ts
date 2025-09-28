import { mapMimeTypeToFileFormat } from "@/helpers/utils.ts";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.ts";
import type { ResourceIntent } from "@/types/resource.ts";
import { prisma } from "@/lib/prisma.ts";

export class ResourcePrismaRepository implements IResourceRepository {
	async validateResourceRule(
		resourceIntent: ResourceIntent
	): Promise<{ path: string }> {
		const resourceTypeRule = await prisma.resourceType.findFirst({
			where: {
				name: resourceIntent.resourceType,
				for: resourceIntent.forResource,
				width: resourceIntent.width,
				height: resourceIntent.height,
				availableFormats: {
					some: {
						type: mapMimeTypeToFileFormat(resourceIntent.fileMimeType)
					}
				}
			},
			select: {
				path: true
			}
		});

		if (!resourceTypeRule) {
			throw new Error(
				"Regra de recurso inválida ou não definida para o upload."
			);
		}

		return resourceTypeRule;
	}
}
