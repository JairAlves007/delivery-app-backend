import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.ts";
import { DeleteEstablishmentService } from "@/services/establishment/delete-establishment-service.ts";

export const makeDeleteEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new DeleteEstablishmentService(establishmentRepository);
};
