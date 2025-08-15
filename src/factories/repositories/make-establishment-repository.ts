import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository.ts";

export const makeEstablishmentRepository = () => {
	return new EstablishmentPrismaRepository();
};
