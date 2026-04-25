import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.js";
import { UpdateAddonService } from "@/services/addon/update-addon-service.js";

export const makeUpdateAddonService = () => {
  const addonRepository = makeAddonRepository();
  return new UpdateAddonService(addonRepository);
};
