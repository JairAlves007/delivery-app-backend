import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { FindEstablishmentBySlugService } from "@/services/establishment/find-establishment-by-slug-service.js";

export const makeFindEstablishmentBySlugService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new FindEstablishmentBySlugService(establishmentRepository);
};
