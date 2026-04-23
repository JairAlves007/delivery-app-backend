import { RoleType } from "@/generated/prisma/client.js";

type ResolveEstablishmentScopeParams = {
	role: RoleType;
	primaryTenantId?: string | null;
	establishmentId?: string;
};

export const resolveEstablishmentScope = ({
	role,
	primaryTenantId,
	establishmentId
}: ResolveEstablishmentScopeParams): string | null => {
	if (role !== RoleType.ADMIN) return primaryTenantId ?? null;

	return establishmentId ?? null;
};
