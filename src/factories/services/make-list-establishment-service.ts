import { ListEstablishmentService } from "@/services/list-establishment-service";
import { makeEstablishmentRepository } from "../repositories/make-establishment-repository";

export const makeListEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new ListEstablishmentService(establishmentRepository);
};
