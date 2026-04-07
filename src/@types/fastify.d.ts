import "fastify";

import { RoleType } from "@/generated/prisma/client.js";

declare module "fastify" {
	interface FastifyRequest {
		role: RoleType;
	}
}
