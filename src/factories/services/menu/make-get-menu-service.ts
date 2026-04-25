import { makeMenuRepository } from "@/factories/repositories/make-menu-repository.js";
import { GetMenuService } from "@/services/menu/get-menu-service.js";

export const makeGetMenuService = () => {
  const menuRepository = makeMenuRepository();
  return new GetMenuService(menuRepository);
};
