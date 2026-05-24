import { makeClosureRepository } from "@/factories/repositories/make-closure-repository.js";
import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { ReopenEstablishmentService } from "@/services/closure/reopen-establishment-service.js";

export const makeReopenEstablishmentService = () => {
	const closureRepository = makeClosureRepository();
	const establishmentRepository = makeEstablishmentRepository();
	return new ReopenEstablishmentService(
		closureRepository,
		establishmentRepository
	);
};
