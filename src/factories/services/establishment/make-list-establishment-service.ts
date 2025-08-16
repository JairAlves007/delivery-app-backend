import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.ts";
import { ListEstablishmentService } from "@/services/establishment/list-establishment-service.ts";

export const makeListEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new ListEstablishmentService(establishmentRepository);
};
