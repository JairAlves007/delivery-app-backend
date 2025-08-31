import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.ts";
import { ListAddonService } from "@/services/addon/list-addon-service.ts";

export const makeListAddonService = () => {
	const addonRepository = makeAddonRepository();
	return new ListAddonService(addonRepository);
};
