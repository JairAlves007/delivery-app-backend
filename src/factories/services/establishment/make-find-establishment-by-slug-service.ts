import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.ts";
import { FindEstablishmentBySlugService } from "@/services/establishment/find-establishment-by-slug-service.ts";

export const makeFindEstablishmentBySlugService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new FindEstablishmentBySlugService(establishmentRepository);
};
