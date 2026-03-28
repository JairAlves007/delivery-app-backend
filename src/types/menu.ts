import type { Prisma } from "@/generated/prisma/client.js";

export type MenuWithSubmenus = Prisma.MenuGetPayload<{
	select: {
		label: true;
		slug: true;
		order: true;
		submenus: { select: { label: true; slug: true; order: true } };
	};
}>;
