import { makeCreateMenuForNewEstablishmentService } from "@/factories/services/menu/make-create-menu-for-new-establishment-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import type { EstablishmentID } from "@/types/establishment.ts";
import { logger, task } from "@trigger.dev/sdk";

export const createMenuForNewEstablishmentId =
	"create-menu-for-new-establishment";

export const createMenuForNewEstablishmentTask = task({
	id: createMenuForNewEstablishmentId,
	queue: {
		name: createMenuForNewEstablishmentId
	},
	onFailure: async () => {
		logger.log("Error creating menu for new establishment!");
	},
	run: async (
		{ establishmentId }: { establishmentId: EstablishmentID },
		{ ctx }
	) => {
		logger.log("Creating menu!", { establishmentId, ctx });

		const createMenuService = makeCreateMenuForNewEstablishmentService();

		await createMenuService.handle(establishmentId);

		return ApiResponse.success("Menu criado com sucesso!", {});
	}
});
