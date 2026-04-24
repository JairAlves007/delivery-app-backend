import { mapObjectResourcesList } from "@/helpers/resource.js";
import type {
	EstablishmentFromRepository,
	EstablishmentsList
} from "@/types/establishment.js";

export const mapEstablishment = (
	establishment: EstablishmentFromRepository
): EstablishmentsList => ({
	...establishment,
	address: establishment.address?.address ?? null,
	resources: mapObjectResourcesList(establishment.resources)
});

export const mapEstablishments = (
	establishments: EstablishmentFromRepository[]
): EstablishmentsList[] => establishments.map(mapEstablishment);
