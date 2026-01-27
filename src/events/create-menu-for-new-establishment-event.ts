import { TypedEventEmitter } from "@/classes/event-emitter.ts";
import type { CreateMenuForNewEstablishmentEventType } from "@/types/establishment.ts";

type CreateMenuForNewEstablishmentParams = {
	"create-menu-for-new-establishment": CreateMenuForNewEstablishmentEventType;
};

export const createMenuForNewEstablishmentEvent =
	new TypedEventEmitter<CreateMenuForNewEstablishmentParams>();
