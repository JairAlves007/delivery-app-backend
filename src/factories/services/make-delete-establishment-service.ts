import { DeleteEstablishmentService } from "@/services/delete-establishment-service";
import { makeEstablishmentRepository } from "../repositories/make-establishment-repository";

export const makeDeleteEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new DeleteEstablishmentService(establishmentRepository);
};
