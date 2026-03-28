import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { UpdateEstablishmentService } from "@/services/establishment/update-establishment-service.js";

export const makeUpdateEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new UpdateEstablishmentService(establishmentRepository);
};
