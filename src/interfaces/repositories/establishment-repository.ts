import type { Establishment, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { EstablishmentWithInfo } from "@/types/establishment.ts";

export interface IEstablishmentRepository
	extends ICRUDBase<
		Establishment,
		Prisma.EstablishmentCreateInput,
		Prisma.EstablishmentUpdateInput,
		string
	> {
	findBySlug(slug: string): Promise<EstablishmentWithInfo | null>;
}
