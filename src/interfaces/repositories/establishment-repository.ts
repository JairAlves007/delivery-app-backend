import type { Establishment, Prisma } from "@/generated/prisma/client.js";
import type { EstablishmentFromRepository } from "@/types/establishment.js";

import type { ICRUDBase } from "../crud-base.js";

export interface IEstablishmentRepository extends ICRUDBase<
	EstablishmentFromRepository,
	Prisma.EstablishmentCreateInput,
	Prisma.EstablishmentUpdateInput,
	string,
	Establishment
> {
	findBySlug(slug: string): Promise<EstablishmentFromRepository | null>;
}
