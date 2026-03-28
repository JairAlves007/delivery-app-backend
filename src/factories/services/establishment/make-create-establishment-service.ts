import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { CreateEstablishmentService } from "@/services/establishment/create-establishment-service.js";

export const makeCreateEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new CreateEstablishmentService(establishmentRepository);
};
