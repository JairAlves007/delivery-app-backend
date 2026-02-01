import { Prisma } from "@/generated/prisma/client.ts";

export type AddonCategoryFromRepository = Prisma.AddonCategoryGetPayload<{
	include: {
		addons: true;
	};
}>;
