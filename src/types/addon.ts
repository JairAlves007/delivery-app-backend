import { Prisma } from "@/generated/prisma/client.ts";

export type AddonFromRepository = Prisma.AddonGetPayload<{
	include: {
		category: true;
	};
}>;
