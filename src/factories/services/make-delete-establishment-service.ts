import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository";
import { DeleteEstablishmentService } from "@/services/delete-establishment-service";

export const makeDeleteEstablishmentService = () => {
	const establishmentRepository = new EstablishmentPrismaRepository();
	return new DeleteEstablishmentService(establishmentRepository);
};
