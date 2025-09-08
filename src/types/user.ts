import type { Prisma, RoleType } from "@prisma/client";

export type Profile = Prisma.UserGetPayload<{
	select: {
		name: true;
		email: true;
		establishment: { select: { slug: true } };
	};
}> & {
	role: RoleType;
};

export type UserWithRole = Prisma.UserGetPayload<{
	include: { role: true; establishment: true };
}>;
