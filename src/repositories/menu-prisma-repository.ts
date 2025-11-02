import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.ts";
import { prisma } from "@/lib/prisma.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import type { MenuWithSubmenus } from "@/types/menu.ts";
import { type Prisma, RoleType, ViewType } from "@prisma/client";

export class MenuPrismaRepository implements IMenuRepository {
	async get(
		forRole: RoleType,
		establishmentId: EstablishmentID
	): Promise<MenuWithSubmenus[] | null> {
		return await prisma.menu.findMany({
			where: {
				for_role: forRole,
				establishment_id: establishmentId
			},
			select: {
				label: true,
				slug: true,
				order: true,
				submenus: {
					select: {
						label: true,
						slug: true,
						order: true
					},
					orderBy: { order: "asc" }
				}
			},
			orderBy: { order: "asc" }
		});
	}

	async createForNewEstablishment(
		establishmentId: EstablishmentID
	): Promise<void> {
		const customerMenuItems: Prisma.MenuCreateManyInput[] = [
			{
				label: "Cardápio",
				slug: "catalog",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_CATALOG,
				order: 1,
				for_role: RoleType.CUSTOMER
			},
			{
				label: "Sacola",
				slug: "bag",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_OWN_BAG,
				order: 2,
				for_role: RoleType.CUSTOMER
			},
			{
				label: "Favoritos",
				slug: "favorites",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_OWN_FAVORITES,
				order: 3,
				for_role: RoleType.CUSTOMER
			},
			{
				label: "Meus Pedidos",
				slug: "orders",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_OWN_ORDERS,
				order: 4,
				for_role: RoleType.CUSTOMER
			},
			{
				label: "Meus Endereços",
				slug: "addresses",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_OWN_ADDRESSES,
				order: 5,
				for_role: RoleType.CUSTOMER
			}
		];

		const establishmentOwnerMenuItems: Prisma.MenuCreateManyInput[] = [
			{
				label: "Produtos",
				slug: "products",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_PRODUCTS,
				order: 4,
				for_role: RoleType.ESTABLISHMENT_OWNER
			},
			{
				label: "Categorias dos Produtos",
				slug: "product-categories",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_PRODUCT_CATEGORIES,
				order: 5,
				for_role: RoleType.ESTABLISHMENT_OWNER
			},
			{
				label: "Pedidos",
				slug: "orders",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_ORDERS,
				order: 6,
				for_role: RoleType.ESTABLISHMENT_OWNER
			},
			{
				label: "Cupons",
				slug: "coupons",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_COUPONS,
				order: 7,
				for_role: RoleType.ESTABLISHMENT_OWNER
			}
		];

		const adminMenuItems: Prisma.MenuCreateManyInput[] = [
			{
				label: "Dashboard",
				slug: "dashboard",
				establishment_id: establishmentId,
				order: 1,
				for_role: RoleType.ADMIN
			},
			{
				label: "Estabelecimentos",
				slug: "establishments",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_ESTABLISHMENTS,
				order: 2,
				for_role: RoleType.ADMIN
			},
			{
				label: "Clientes",
				slug: "customers",
				establishment_id: establishmentId,
				view_type: ViewType.VIEW_CUSTOMERS,
				order: 3,
				for_role: RoleType.ADMIN
			},
			...establishmentOwnerMenuItems.map(menu => ({
				...menu,
				for_role: RoleType.ADMIN
			}))
		];

		await prisma.menu.createMany({
			data: customerMenuItems
		});

		const establishmentOwnerMenus = await prisma.menu.createManyAndReturn({
			data: establishmentOwnerMenuItems
		});

		const adminMenus = await prisma.menu.createManyAndReturn({
			data: adminMenuItems
		});

		const establishmentOwnerSubmenuItems: Prisma.SubMenuCreateManyInput[] = [
			{
				label: "Ver produtos",
				slug: "view",
				order: 1,
				menu_id: establishmentOwnerMenus[0].id,
				view_type: ViewType.VIEW_PRODUCTS
			},
			{
				label: "Criar produto",
				slug: "create",
				order: 2,
				menu_id: establishmentOwnerMenus[0].id,
				view_type: ViewType.CREATE_PRODUCT
			},
			{
				label: "Ver categorias dos produtos",
				slug: "view",
				order: 1,
				menu_id: establishmentOwnerMenus[1].id,
				view_type: ViewType.VIEW_PRODUCT_CATEGORIES
			},
			{
				label: "Criar categoria de produto",
				slug: "create",
				order: 2,
				menu_id: establishmentOwnerMenus[1].id,
				view_type: ViewType.CREATE_PRODUCT_CATEGORY
			},
			{
				label: "Ver cupons",
				slug: "view",
				order: 1,
				menu_id: establishmentOwnerMenus[3].id,
				view_type: ViewType.VIEW_COUPONS
			},
			{
				label: "Criar cupom",
				slug: "create",
				order: 2,
				menu_id: establishmentOwnerMenus[3].id,
				view_type: ViewType.CREATE_COUPON
			}
		];

		const adminSubmenuItems: Prisma.SubMenuCreateManyInput[] = [
			{
				label: "Ver estabelecimentos",
				slug: "view",
				order: 1,
				menu_id: adminMenus[1].id,
				view_type: ViewType.VIEW_ESTABLISHMENTS
			},
			{
				label: "Criar estabelecimento",
				slug: "create",
				order: 2,
				menu_id: adminMenus[1].id,
				view_type: ViewType.CREATE_ESTABLISHMENT
			},
			{
				label: "Ver clientes",
				slug: "view",
				order: 1,
				menu_id: adminMenus[2].id,
				view_type: ViewType.VIEW_CUSTOMERS
			},
			{
				label: "Criar Dono de estabelecimento",
				slug: "create-establishment-owner",
				order: 1,
				menu_id: adminMenus[2].id,
				view_type: ViewType.CREATE_ESTABLISHMENT_OWNER
			},
			{
				label: "Ver produtos",
				slug: "view",
				order: 1,
				menu_id: adminMenus[3].id,
				view_type: ViewType.VIEW_PRODUCTS
			},
			{
				label: "Criar produto",
				slug: "create",
				order: 2,
				menu_id: adminMenus[3].id,
				view_type: ViewType.CREATE_PRODUCT
			},
			{
				label: "Ver categorias dos produtos",
				slug: "view",
				order: 1,
				menu_id: adminMenus[4].id,
				view_type: ViewType.VIEW_PRODUCT_CATEGORIES
			},
			{
				label: "Criar categoria de produto",
				slug: "create",
				order: 2,
				menu_id: adminMenus[4].id,
				view_type: ViewType.CREATE_PRODUCT_CATEGORY
			},
			{
				label: "Ver cupons",
				slug: "view",
				order: 1,
				menu_id: adminMenus[6].id,
				view_type: ViewType.VIEW_COUPONS
			},
			{
				label: "Criar cupom",
				slug: "create",
				order: 2,
				menu_id: adminMenus[6].id,
				view_type: ViewType.CREATE_COUPON
			}
		];

		await prisma.subMenu.createMany({
			data: establishmentOwnerSubmenuItems
		});

		await prisma.subMenu.createMany({
			data: adminSubmenuItems
		});
	}
}
