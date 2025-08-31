import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.ts";
import { UpdateAddonService } from "@/services/addon/update-addon-service.ts";

export const makeUpdateAddonService = () => {
	const addonRepository = makeAddonRepository();
	return new UpdateAddonService(addonRepository);
};
