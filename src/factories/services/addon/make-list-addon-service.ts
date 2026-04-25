import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.js";
import { ListAddonService } from "@/services/addon/list-addon-service.js";

export const makeListAddonService = () => {
  const addonRepository = makeAddonRepository();
  return new ListAddonService(addonRepository);
};
