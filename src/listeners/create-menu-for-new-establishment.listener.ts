import { createMenuForNewEstablishmentEvent } from "@/events/create-menu-for-new-establishment-event.ts";
import { forgetAllListingCacheKeysEvent } from "@/events/forget-listing-cache-keys-event.ts";
import { makeCreateMenuForNewEstablishmentService } from "@/factories/services/menu/make-create-menu-for-new-establishment-service.ts";
import type { CreateMenuForNewEstablishmentEventType } from "@/types/establishment.ts";

createMenuForNewEstablishmentEvent.on(
	"create-menu-for-new-establishment",
	async ({
		establishmentId,
		paramsToForget
	}: CreateMenuForNewEstablishmentEventType) => {
		console.log(
			`[Event] Creating menu for new establishment: ${establishmentId}`
		);

		const createMenuService = makeCreateMenuForNewEstablishmentService();

		await createMenuService.handle({
			establishmentId,
			paramsToForget: { establishment_id: establishmentId }
		});

		forgetAllListingCacheKeysEvent.emit("forget-all-listing-cache-keys", {
			baseCacheKey: "establishments",
			paramsToForget: paramsToForget
		});
	}
);
