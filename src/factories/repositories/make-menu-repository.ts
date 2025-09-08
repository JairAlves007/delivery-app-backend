import { MenuPrismaRepository } from "@/repositories/menu-prisma-repository.ts";

export const makeMenuRepository = () => {
	return new MenuPrismaRepository();
};
