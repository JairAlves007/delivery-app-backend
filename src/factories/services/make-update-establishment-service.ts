import { EstablishmentPrismaRepository } from "@/repositories/establishment-prisma-repository";
import { UpdateEstablishmentService } from "@/services/update-establishment-service";

export const makeUpdateEstablishmentService = () => {
	const establishmentRepository = new EstablishmentPrismaRepository();
	return new UpdateEstablishmentService(establishmentRepository);
};
