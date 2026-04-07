import "@fastify/jwt";

import type { RoleType } from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";

declare module "@fastify/jwt" {
	export interface FastifyJWT {
		user: {
			sub: string;
			activeTenantId: EstablishmentID;
			primaryTenantId?: EstablishmentID | null;
			role: RoleType;
		};
	}
}
