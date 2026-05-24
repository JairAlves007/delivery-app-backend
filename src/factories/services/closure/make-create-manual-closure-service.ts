import { makeClosureRepository } from "@/factories/repositories/make-closure-repository.js";
import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { CreateManualClosureService } from "@/services/closure/create-manual-closure-service.js";

export const makeCreateManualClosureService = () => {
	const closureRepository = makeClosureRepository();
	const establishmentRepository = makeEstablishmentRepository();
	return new CreateManualClosureService(
		closureRepository,
		establishmentRepository
	);
};
