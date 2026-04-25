import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.js";
import { FindAddonService } from "@/services/addon/find-addon-service.js";

export const makeFindAddonService = () => {
  const addonRepository = makeAddonRepository();
  return new FindAddonService(addonRepository);
};
