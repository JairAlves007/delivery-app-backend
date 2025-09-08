import type { Prisma } from "@prisma/client";

export type MenuWithSubmenus = Prisma.MenuGetPayload<{
	select: {
		label: true;
		slug: true;
		order: true;
		submenus: { select: { label: true; slug: true; order: true } };
	};
}>;
