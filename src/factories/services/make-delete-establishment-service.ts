import { DeleteEstablishmentService } from "@/services/delete-establishment-service.ts";
import { makeEstablishmentRepository } from "../repositories/make-establishment-repository.ts";

export const makeDeleteEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new DeleteEstablishmentService(establishmentRepository);
};
