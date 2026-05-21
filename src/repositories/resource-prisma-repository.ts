import type { Prisma, Resource } from "@/generated/prisma/client.js";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.js";
import prisma from "@/lib/prisma.js";
import type { ResourceWithJoinCounts } from "@/types/resource.js";
import type {
  ResourceRuleFromRepository,
  UploadResourceRulesParams,
  ValidateResourceRuleParams,
} from "@/types/resource-rule.js";

export class ResourcePrismaRepository implements IResourceRepository {
  async validateResourceRule({
    resourceIntent: { type, for: forResource },
  }: ValidateResourceRuleParams): Promise<ResourceRuleFromRepository | null> {
    return await prisma.resourceRule.findUnique({
      where: {
        type_for: {
          type,
          for: forResource,
        },
      },
      include: {
        availableFormats: true,
      },
    });
  }

  async getUploadResourceRules({
    forObject,
  }: UploadResourceRulesParams): Promise<ResourceRuleFromRepository[]> {
    return await prisma.resourceRule.findMany({
      where: {
        for: forObject,
      },
      include: {
        availableFormats: true,
      },
    });
  }

  async storeResource(data: Prisma.ResourceUpsertArgs): Promise<Resource> {
    return await prisma.resource.upsert(data);
  }

  async findByIdAndEstablishment({
    resourceId,
    establishmentId,
  }: {
    resourceId: string;
    establishmentId: string;
  }): Promise<ResourceWithJoinCounts | null> {
    return await prisma.resource.findFirst({
      where: {
        id: resourceId,
        establishment_id: establishmentId,
      },
      include: {
        _count: {
          select: {
            productResources: true,
            establishmentResources: true,
            productCategoryResources: true,
            bannerResources: true,
          },
        },
      },
    });
  }

  async deleteResource({ resourceId }: { resourceId: string }): Promise<void> {
    await prisma.resource.delete({
      where: {
        id: resourceId,
      },
    });
  }
}
