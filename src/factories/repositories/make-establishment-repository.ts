import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository";

export const makeEstablishmentRepository = () => {
	return new EstablishmentPrismaRepository();
};
