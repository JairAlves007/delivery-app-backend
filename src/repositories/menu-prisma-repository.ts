import { RoleType, ViewType } from "@/generated/prisma/client.js";
import type { IMenuRepository } from "@/interfaces/repositories/menu-repository.js";
import prisma from "@/lib/prisma.js";
import type { MenuWithSubmenus } from "@/types/menu.js";

type DefaultSubmenu = {
	label: string;
	slug: string;
	view_type: ViewType;
	order: number;
};

type DefaultMenu = {
	label: string;
	slug: string;
	for_role: RoleType;
	view_type: ViewType | null;
	order: number;
	submenus?: DefaultSubmenu[];
};

const defaultMenus: DefaultMenu[] = [
	{
		label: "Cardápio",
		slug: "catalog",
		view_type: ViewType.VIEW_CATALOG,
		order: 1,
		for_role: RoleType.CUSTOMER
	},
	{
		label: "Sacola",
		slug: "bag",
		view_type: ViewType.VIEW_OWN_BAG,
		order: 2,
		for_role: RoleType.CUSTOMER
	},
	{
		label: "Favoritos",
		slug: "favorites",
		view_type: ViewType.VIEW_OWN_FAVORITES,
		order: 3,
		for_role: RoleType.CUSTOMER
	},
	{
		label: "Meus Pedidos",
		slug: "orders",
		view_type: ViewType.VIEW_OWN_ORDERS,
		order: 4,
		for_role: RoleType.CUSTOMER
	},
	{
		label: "Meus Endereços",
		slug: "addresses",
		view_type: ViewType.VIEW_OWN_ADDRESSES,
		order: 5,
		for_role: RoleType.CUSTOMER
	},

	// Establishment owner
	{
		label: "Dashboard",
		slug: "dashboard",
		view_type: ViewType.VIEW_DASHBOARD,
		order: 1,
		for_role: RoleType.ESTABLISHMENT_OWNER
	},
	{
		label: "Produtos",
		slug: "products",
		view_type: ViewType.VIEW_PRODUCTS,
		order: 4,
		for_role: RoleType.ESTABLISHMENT_OWNER,
		submenus: [
			{
				label: "Ver Categorias dos Produtos",
				slug: "view-product-categories",
				view_type: ViewType.VIEW_PRODUCT_CATEGORIES,
				order: 1
			},
			{
				label: "Ver Produtos",
				slug: "view-products",
				view_type: ViewType.VIEW_PRODUCTS,
				order: 2
			},
			{
				label: "Ver Tags",
				slug: "view-tags",
				view_type: ViewType.VIEW_TAGS,
				order: 3
			}
		]
	},
	{
		label: "Adicionais",
		slug: "addons",
		view_type: ViewType.VIEW_ADDONS,
		order: 5,
		for_role: RoleType.ESTABLISHMENT_OWNER,
		submenus: [
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
	},
	{
		label: "Pedidos",
		slug: "orders",
		view_type: ViewType.VIEW_ORDERS,
		order: 6,
		for_role: RoleType.ESTABLISHMENT_OWNER
	},
	{
		label: "Cupons",
		slug: "coupons",
		view_type: ViewType.VIEW_COUPONS,
		order: 7,
		for_role: RoleType.ESTABLISHMENT_OWNER
	},
	{
		label: "Banners",
		slug: "banners",
		view_type: ViewType.VIEW_BANNERS,
		order: 8,
		for_role: RoleType.ESTABLISHMENT_OWNER
	},
	{
		label: "Distritos",
		slug: "districts",
		view_type: ViewType.VIEW_DISTRICTS,
		order: 9,
		for_role: RoleType.ESTABLISHMENT_OWNER
	},

	// Admin
	{
		label: "Dashboard",
		slug: "dashboard",
		view_type: ViewType.VIEW_DASHBOARD,
		order: 1,
		for_role: RoleType.ADMIN
	},
	{
		label: "Estabelecimentos",
		slug: "establishments",
		view_type: ViewType.VIEW_ESTABLISHMENTS,
		order: 2,
		for_role: RoleType.ADMIN
	},
	{
		label: "Clientes",
		slug: "customers",
		view_type: ViewType.VIEW_CUSTOMERS,
		order: 3,
		for_role: RoleType.ADMIN
	},
	{
		label: "Produtos",
		slug: "products",
		view_type: ViewType.VIEW_PRODUCTS,
		order: 4,
		for_role: RoleType.ADMIN,
		submenus: [
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
			},
			{
				label: "Ver Tags",
				slug: "view-tags",
				view_type: ViewType.VIEW_TAGS,
				order: 3
			}
		]
	},
	{
		label: "Adicionais",
		slug: "addons",
		view_type: ViewType.VIEW_ADDONS,
		order: 5,
		for_role: RoleType.ADMIN,
		submenus: [
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
	},
	{
		label: "Pedidos",
		slug: "orders",
		view_type: ViewType.VIEW_ORDERS,
		order: 6,
		for_role: RoleType.ADMIN
	},
	{
		label: "Cupons",
		slug: "coupons",
		view_type: ViewType.VIEW_COUPONS,
		order: 7,
		for_role: RoleType.ADMIN
	},
	{
		label: "Banners",
		slug: "banners",
		view_type: ViewType.VIEW_BANNERS,
		order: 8,
		for_role: RoleType.ADMIN
	},
	{
		label: "Distritos",
		slug: "districts",
		view_type: ViewType.VIEW_DISTRICTS,
		order: 9,
		for_role: RoleType.ADMIN
	}
];

export class MenuPrismaRepository implements IMenuRepository {
	async get(forRole: RoleType): Promise<MenuWithSubmenus[] | null> {
		return await prisma.menu.findMany({
			where: { for_role: forRole },
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

	async ensureDefaults(): Promise<void> {
		for (const menu of defaultMenus) {
			await prisma.menu.upsert({
				where: { slug_for_role: { slug: menu.slug, for_role: menu.for_role } },
				update: {
					label: menu.label,
					view_type: menu.view_type,
					order: menu.order
				},
				create: {
					label: menu.label,
					slug: menu.slug,
					view_type: menu.view_type,
					order: menu.order,
					for_role: menu.for_role,
					submenus: menu.submenus ? { create: menu.submenus } : undefined
				}
			});
		}
	}
}
