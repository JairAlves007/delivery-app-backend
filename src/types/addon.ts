import { Prisma } from "@prisma/client";

export type AddonFromRepository = Prisma.AddonGetPayload<{
	include: {
		category: true;
	};
}>;
