import { MenuPrismaRepository } from "@/repositories/menu-prisma-repository.js";

export const makeMenuRepository = () => {
	return new MenuPrismaRepository();
};
