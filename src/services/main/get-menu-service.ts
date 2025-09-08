import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.ts";
import type { MenuWithSubmenus } from "@/types/menu.ts";
import type { RoleType } from "@prisma/client";

export class GetMenuService {
	private menuRepository: IMenuRepository;

	constructor(menuRepository: IMenuRepository) {
		this.menuRepository = menuRepository;
	}

	async handle(
		forRole: RoleType,
		establishmentId: string
	): Promise<MenuWithSubmenus[] | null> {
		const cache = makeCache();

		const menu = await cache.rememberForever(
			`${cache.keys.menus}_${forRole.toLowerCase()}_${establishmentId}`,
			async () => await this.menuRepository.get(forRole, establishmentId)
		);

		return menu;
	}
}
