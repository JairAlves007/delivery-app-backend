import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.ts";
import { FindEstablishmentByIdService } from "@/services/establishment/find-establishment-by-id-service.ts";

export const makeFindEstablishmentByIdService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new FindEstablishmentByIdService(establishmentRepository);
};
