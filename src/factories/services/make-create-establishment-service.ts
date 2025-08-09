import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository";
import { CreateEstablishmentService } from "@/services/create-establishment-service";

export const makeCreateEstablishmentService = () => {
	const establishmentRepository = new EstablishmentPrismaRepository();
	return new CreateEstablishmentService(establishmentRepository);
};
