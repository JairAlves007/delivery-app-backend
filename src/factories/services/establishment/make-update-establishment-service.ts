import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.ts";
import { UpdateEstablishmentService } from "@/services/establishment/update-establishment-service.ts";

export const makeUpdateEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new UpdateEstablishmentService(establishmentRepository);
};
