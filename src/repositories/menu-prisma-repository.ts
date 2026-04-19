import { type Prisma, RoleType, ViewType } from "@/generated/prisma/client.js";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.js";
import prisma from "@/lib/prisma.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { MenuWithSubmenus } from "@/types/menu.js";

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
				view_type: true,
				submenus: {
					select: {
						label: true,
						slug: true,
						view_type: true,
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

		const createEstablishmentOwnerMenus = async () => {
			await prisma.menu.create({
				data: {
					label: "Produtos",
					slug: "products",
					establishment_id: establishmentId,
					view_type: ViewType.VIEW_PRODUCTS,
					order: 4,
					for_role: RoleType.ESTABLISHMENT_OWNER,
					submenus: {
						create: [
							{
								label: "Ver Categorias dos Produtos",
								slug: "view-product-categories",
								view_type: ViewType.VIEW_PRODUCT_CATEGORIES,
								order: 1
							},
							{
								label: "Ver produtos",
								slug: "view-products",
								view_type: ViewType.VIEW_PRODUCTS,
								order: 2
							}
						]
					}
				}
			});

			await prisma.menu.create({
				data: {
					label: "Adicionais",
					slug: "addons",
					establishment_id: establishmentId,
					view_type: ViewType.VIEW_ADDONS,
					order: 5,
					for_role: RoleType.ESTABLISHMENT_OWNER,
					submenus: {
						create: [
							{
								label: "Ver Categorias dos Adicionais",
								slug: "view-addon-categories",
								view_type: ViewType.VIEW_ADDON_CATEGORIES,
								order: 1
							},
							{
								label: "Ver Adicionais",
								slug: "view-addons",
								view_type: ViewType.VIEW_ADDONS,
								order: 2
							}
						]
					}
				}
			});

			await prisma.menu.createMany({
				data: [
					{
						label: "Dashboard",
						slug: "dashboard",
						establishment_id: establishmentId,
						view_type: ViewType.VIEW_DASHBOARD,
						order: 1,
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
					},
					{
						label: "Banners",
						slug: "banners",
						establishment_id: establishmentId,
						view_type: ViewType.VIEW_BANNERS,
						order: 8,
						for_role: RoleType.ESTABLISHMENT_OWNER
					},
					{
						label: "Distritos",
						slug: "districts",
						establishment_id: establishmentId,
						view_type: ViewType.VIEW_DISTRICTS,
						order: 9,
						for_role: RoleType.ESTABLISHMENT_OWNER
					}
				]
			});
		};

		const createAdminMenus = async () => {
			await prisma.menu.create({
				data: {
					label: "Produtos",
					slug: "products",
					establishment_id: establishmentId,
					view_type: ViewType.VIEW_PRODUCTS,
					order: 4,
					for_role: RoleType.ADMIN,
					submenus: {
						create: [
							{
								label: "Ver Categorias dos Produtos",
								slug: "view-product-categories",
								view_type: ViewType.VIEW_PRODUCT_CATEGORIES,
								order: 1
							},
							{
								label: "Ver produtos",
								slug: "view-products",
								view_type: ViewType.VIEW_PRODUCTS,
								order: 2
							}
						]
					}
				}
			});

			await prisma.menu.create({
				data: {
					label: "Adicionais",
					slug: "addons",
					establishment_id: establishmentId,
					view_type: ViewType.VIEW_ADDONS,
					order: 5,
					for_role: RoleType.ADMIN,
					submenus: {
						create: [
							{
								label: "Ver Categorias dos Adicionais",
								slug: "view-addon-categories",
								view_type: ViewType.VIEW_ADDON_CATEGORIES,
								order: 1
							},
							{
								label: "Ver Adicionais",
								slug: "view-addons",
								view_type: ViewType.VIEW_ADDONS,
								order: 2
							}
						]
					}
				}
			});

			await prisma.menu.createMany({
				data: [
					{
						label: "Pedidos",
						slug: "orders",
						establishment_id: establishmentId,
						view_type: ViewType.VIEW_ORDERS,
						order: 6,
						for_role: RoleType.ADMIN
					},
					{
						label: "Cupons",
						slug: "coupons",
						establishment_id: establishmentId,
						view_type: ViewType.VIEW_COUPONS,
						order: 7,
						for_role: RoleType.ADMIN
					}
				]
			});
		};

		await prisma.menu.createMany({
			data: customerMenuItems
		});

		await createEstablishmentOwnerMenus();

		await prisma.menu.createMany({
			data: [
				{
					label: "Dashboard",
					slug: "dashboard",
					establishment_id: establishmentId,
					view_type: ViewType.VIEW_DASHBOARD,
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
				}
			]
		});

		await createAdminMenus();
	}
}
