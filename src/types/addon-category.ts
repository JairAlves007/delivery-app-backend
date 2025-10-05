import { Prisma } from "@prisma/client";

export type AddonCategoryFromRepository = Prisma.AddonCategoryGetPayload<{
	include: {
		addons: true;
	};
}>;
