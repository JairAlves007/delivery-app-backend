// types/fastify.d.ts
import { UserWithRoleType } from "@/interfaces/user";
import { RoleType } from "@prisma/client";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		role: RoleType;
	}
}
