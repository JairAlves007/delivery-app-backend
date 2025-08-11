// types/fastify.d.ts
import { RoleType } from "@prisma/client";
import "fastify";

declare module "fastify" {
	interface FastifyRequest {
		role: RoleType;
	}
}
