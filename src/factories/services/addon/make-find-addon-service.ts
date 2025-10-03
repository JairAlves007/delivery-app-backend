import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.ts";
import { FindAddonService } from "@/services/addon/find-addon-service.ts";

export const makeFindAddonService = () => {
	const addonRepository = makeAddonRepository();
	return new FindAddonService(addonRepository);
};
