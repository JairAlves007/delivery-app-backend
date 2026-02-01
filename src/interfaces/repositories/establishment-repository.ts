import type { Establishment, Prisma } from "@/generated/prisma/client.ts";
import type { EstablishmentFromRepository } from "@/types/establishment.ts";
import type { ICRUDBase } from "../crud-base.ts";

export interface IEstablishmentRepository extends ICRUDBase<
	EstablishmentFromRepository,
	Prisma.EstablishmentCreateInput,
	Prisma.EstablishmentUpdateInput,
	string,
	Establishment
> {
	findBySlug(slug: string): Promise<EstablishmentFromRepository | null>;
}
