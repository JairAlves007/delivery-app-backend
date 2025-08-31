import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.ts";
import { CreateAddonService } from "@/services/addon/create-addon-service.ts";

export const makeCreateAddonService = () => {
	const addonRepository = makeAddonRepository();
	return new CreateAddonService(addonRepository);
};
