import { makeCache } from "@/factories/services/cache/make-cache.ts";
import type { RoleType } from "@/generated/prisma/client.ts";
import { getFilterParamsCacheKey } from "@/helpers/crud.ts";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { MenuWithSubmenus } from "@/types/menu.ts";

type GetMenuServiceResponse = {
	items: MenuWithSubmenus[] | null;
	forRole: RoleType;
};

export class GetMenuService {
	private menuRepository: IMenuRepository;

	constructor(menuRepository: IMenuRepository) {
		this.menuRepository = menuRepository;
	}

	async handle(
		forRole: RoleType,
		establishmentId: EstablishmentID
	): Promise<GetMenuServiceResponse> {
		const cache = makeCache();
		const prefixKey = getFilterParamsCacheKey({
			establishment_id: establishmentId
		});

		const menu = await cache.rememberForever(
			`${prefixKey}${cache.keys.menus}_${forRole.toLowerCase()}`,
			async () => await this.menuRepository.get(forRole, establishmentId)
		);

		return {
			items: menu,
			forRole
		};
	}
}
