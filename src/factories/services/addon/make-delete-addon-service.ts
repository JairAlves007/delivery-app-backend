import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.js";
import { DeleteAddonService } from "@/services/addon/delete-addon-service.js";

export const makeDeleteAddonService = () => {
  const addonRepository = makeAddonRepository();
  return new DeleteAddonService(addonRepository);
};
