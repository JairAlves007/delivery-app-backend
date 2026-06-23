import type { Combo, Prisma } from "@/generated/prisma/client.js";
import type { ComboForOrder, ComboWithRelations } from "@/types/combo.js";
import type { FindByIdParams } from "@/types/crud.js";
import type { EstablishmentID } from "@/types/establishment.js";

import type { ICRUDBase } from "../crud-base.js";

export interface IComboRepository
	extends ICRUDBase<
		Combo,
		Prisma.ComboCreateInput,
		Prisma.ComboUpdateInput,
		string
	> {
	findByIdWithRelations(
		params: FindByIdParams<string>
	): Promise<ComboWithRelations | null>;
	findActiveByEstablishment(
		establishmentId: EstablishmentID
	): Promise<ComboWithRelations[]>;
	findByIdForOrder(
		id: string,
		establishmentId: EstablishmentID
	): Promise<ComboForOrder | null>;
}
