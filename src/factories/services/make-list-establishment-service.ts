import { ListEstablishmentService } from "@/services/list-establishment-service.ts";
import { makeEstablishmentRepository } from "../repositories/make-establishment-repository.ts";

export const makeListEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new ListEstablishmentService(establishmentRepository);
};
