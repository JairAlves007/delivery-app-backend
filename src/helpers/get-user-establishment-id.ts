import { RoleType } from "@/generated/prisma/enums.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";

type UserScope = {
	primaryTenantId?: string | null;
	activeTenantId: string;
	role: RoleType;
};

export const getUserEstablishmentId = (user: UserScope): string => {
	if (user.role === RoleType.ADMIN) return user.activeTenantId;

	const parsed = establishmentIdSchema.safeParse(user.primaryTenantId);
	return parsed.success ? parsed.data : user.activeTenantId;
};
