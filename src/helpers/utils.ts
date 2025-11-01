import type { MenuWithSubmenus } from "@/types/menu.ts";

export function slugify(text: string): string {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/--+/g, "-");
}

export const removeDuplicateItems = <T extends { id: string | number }>(
	items: T[]
): T[] => {
	return [...new Map(items.map(item => [item.id, item])).values()];
};

export function getAvailableRoutes(menu: MenuWithSubmenus[] | null): string[] {
	const routes: string[] = [];

	if (!menu) return routes;

	for (const item of menu) {
		routes.push(`/${item.slug}`);

		if (item.submenus?.length > 0) {
			for (const sub of item.submenus) {
				routes.push(`/${item.slug}/${sub.slug}`);
			}
		}
	}

	return routes;
}
