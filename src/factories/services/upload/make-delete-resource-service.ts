import { makeResourceRepository } from "@/factories/repositories/make-resource-repository.js";
import { DeleteResourceService } from "@/services/upload/delete-resource-service.js";

export const makeDeleteResourceService = () => {
  const resourceRepository = makeResourceRepository();

  return new DeleteResourceService(resourceRepository);
};
