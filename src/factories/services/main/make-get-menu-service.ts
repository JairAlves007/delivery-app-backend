import { makeMenuRepository } from "@/factories/repositories/make-menu-repository.ts";
import { GetMenuService } from "@/services/main/get-menu-service.ts";

export const makeGetMenuService = () => {
	const menuRepository = makeMenuRepository();
	return new GetMenuService(menuRepository);
};
