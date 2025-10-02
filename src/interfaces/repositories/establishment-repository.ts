import type { Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { EstablishmentFromRepository } from "@/types/establishment.ts";

export interface IEstablishmentRepository
	extends ICRUDBase<
		EstablishmentFromRepository,
		Prisma.EstablishmentCreateInput,
		Prisma.EstablishmentUpdateInput,
		string
	> {
	findBySlug(slug: string): Promise<EstablishmentFromRepository | null>;
}
