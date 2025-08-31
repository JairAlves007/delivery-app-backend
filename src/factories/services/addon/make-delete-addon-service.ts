import { makeAddonRepository } from "@/factories/repositories/make-addon-repository.ts";
import { DeleteAddonService } from "@/services/addon/delete-addon-service.ts";

export const makeDeleteAddonService = () => {
	const addonRepository = makeAddonRepository();
	return new DeleteAddonService(addonRepository);
};
