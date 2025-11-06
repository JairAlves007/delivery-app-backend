import { makeMenuRepository } from "@/factories/repositories/make-menu-repository.ts";
import { GetMenuService } from "@/services/menu/get-menu-service.ts";

export const makeGetMenuService = () => {
	const menuRepository = makeMenuRepository();
	return new GetMenuService(menuRepository);
};
