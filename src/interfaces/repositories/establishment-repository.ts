import type { EstablishmentFromRepository } from "@/types/establishment.ts";
import type { Establishment, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface IEstablishmentRepository
	extends ICRUDBase<
		EstablishmentFromRepository,
		Prisma.EstablishmentCreateInput,
		Prisma.EstablishmentUpdateInput,
		string,
		Establishment
	> {
	findBySlug(slug: string): Promise<EstablishmentFromRepository | null>;
}
