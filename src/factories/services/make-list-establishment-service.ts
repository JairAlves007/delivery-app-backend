import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository";
import { ListEstablishmentService } from "@/services/list-establishment-service";

export const makeListEstablishmentService = () => {
	const establishmentRepository = new EstablishmentPrismaRepository();
	return new ListEstablishmentService(establishmentRepository);
};
