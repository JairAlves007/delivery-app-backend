import type { Prisma } from "@/generated/prisma/client.ts";

export type RoleWithPermissions = Prisma.RoleGetPayload<{
	include: {
		permissions: { select: { permission: { select: { name: true } } } };
	};
}>;
