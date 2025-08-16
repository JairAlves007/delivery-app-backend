import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.ts";
import { CreateEstablishmentService } from "@/services/establishment/create-establishment-service.ts";

export const makeCreateEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new CreateEstablishmentService(establishmentRepository);
};
