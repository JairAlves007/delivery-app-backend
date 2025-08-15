import { UpdateEstablishmentService } from "@/services/update-establishment-service.ts";
import { makeEstablishmentRepository } from "../repositories/make-establishment-repository.ts";

export const makeUpdateEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new UpdateEstablishmentService(establishmentRepository);
};
