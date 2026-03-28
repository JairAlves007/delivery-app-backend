import { makeMenuRepository } from "@/factories/repositories/make-menu-repository.js";
import { CreateMenuForNewEstablishmentService } from "@/services/menu/create-menu-for-new-establishment-service.js";

export const makeCreateMenuForNewEstablishmentService = () => {
	const menuRepository = makeMenuRepository();
	return new CreateMenuForNewEstablishmentService(menuRepository);
};
