import { UpdateEstablishmentService } from "@/services/update-establishment-service";
import { makeEstablishmentRepository } from "../repositories/make-establishment-repository";

export const makeUpdateEstablishmentService = () => {
	const establishmentRepository = makeEstablishmentRepository();
	return new UpdateEstablishmentService(establishmentRepository);
};
