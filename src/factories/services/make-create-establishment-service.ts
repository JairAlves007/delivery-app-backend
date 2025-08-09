import { CreateEstablishmentService } from "@/services/create-establishment-service";
import { makeEstablishmentRepository } from "../repositories/make-establishment-repository";

export const makeCreateEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new CreateEstablishmentService(establishmentRepository);
};
