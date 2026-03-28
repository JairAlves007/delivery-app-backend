import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.js";
import { CreateAddonService } from "@/services/addon/create-addon-service.js";

export const makeCreateAddonService = () => {
	const addonRepository = makeAddonRepository();
	return new CreateAddonService(addonRepository);
};
