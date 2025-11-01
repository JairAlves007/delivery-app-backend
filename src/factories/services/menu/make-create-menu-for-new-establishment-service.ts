import { makeMenuRepository } from "@/factories/repositories/make-menu-repository.ts";
import { CreateMenuForNewEstablishmentService } from "@/services/menu/create-menu-for-new-establishment-service.ts";

export const makeCreateMenuForNewEstablishmentService = () => {
	const menuRepository = makeMenuRepository();
	return new CreateMenuForNewEstablishmentService(menuRepository);
};
