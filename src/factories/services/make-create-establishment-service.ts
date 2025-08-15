import { CreateEstablishmentService } from "@/services/create-establishment-service.ts";
import { makeEstablishmentRepository } from "../repositories/make-establishment-repository.ts";

export const makeCreateEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new CreateEstablishmentService(establishmentRepository);
};
