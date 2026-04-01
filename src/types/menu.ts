import type { Prisma } from "@/generated/prisma/client.js";

export type MenuWithSubmenus = Prisma.MenuGetPayload<{
	select: {
		label: true;
		slug: true;
		order: true;
		view_type: true;
		submenus: {
			select: { label: true; slug: true; order: true; view_type: true };
		};
	};
}>;
