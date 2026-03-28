import type { Prisma } from "@/generated/prisma/client.js";

export type RoleWithPermissions = Prisma.RoleGetPayload<{
	include: {
		permissions: { select: { permission: { select: { name: true } } } };
	};
}>;
