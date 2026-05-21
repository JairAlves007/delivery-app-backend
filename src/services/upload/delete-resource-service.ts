import { ResourceNotFound } from "@/errors/resource/resource-not-found-error.js";
import { ForObjectResourceType } from "@/generated/prisma/client.js";
import type { IResourceRepository } from "@/interfaces/repositories/resource-repository.js";
import { enqueueDeleteResource } from "@/queues/resource-queue.js";
import type { EstablishmentID } from "@/types/establishment.js";

type DeleteResourceServiceRequest = {
  resourceId: string;
  establishmentId: EstablishmentID;
};

export class DeleteResourceService {
  private resourceRepository: IResourceRepository;

  constructor(resourceRepository: IResourceRepository) {
    this.resourceRepository = resourceRepository;
  }

  async handle({
    resourceId,
    establishmentId,
  }: DeleteResourceServiceRequest): Promise<void> {
    const resource = await this.resourceRepository.findByIdAndEstablishment({
      resourceId,
      establishmentId,
    });

    if (!resource) throw new ResourceNotFound();

    const forResources: ForObjectResourceType[] = [];

    if (resource._count.productResources > 0)
      forResources.push(ForObjectResourceType.PRODUCT);

    if (resource._count.establishmentResources > 0)
      forResources.push(ForObjectResourceType.ESTABLISHMENT);

    if (resource._count.productCategoryResources > 0)
      forResources.push(ForObjectResourceType.CATEGORY);

    if (resource._count.bannerResources > 0)
      forResources.push(ForObjectResourceType.BANNER);

    const bucketKey = `${resource.path}/${resource.file_key}`;

    await enqueueDeleteResource({
      resourceId: resource.id,
      bucketKey,
      forResources,
    });
  }
}
