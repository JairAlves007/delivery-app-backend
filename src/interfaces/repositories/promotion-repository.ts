import type { Prisma, Promotion } from "@/generated/prisma/client.js";
import type { FilterParams, FindByIdParams } from "@/types/crud.js";
import type { EstablishmentID } from "@/types/establishment.js";
import type { PromotionWithRelations } from "@/types/promotion.js";

import type { ICRUDBase } from "../crud-base.js";

export interface IPromotionRepository
	extends ICRUDBase<
		Promotion,
		Prisma.PromotionCreateInput,
		Prisma.PromotionUpdateInput,
		string
	> {
	findByIdWithRelations(
		params: FindByIdParams<string>
	): Promise<PromotionWithRelations | null>;
	findActiveByEstablishment(
		establishmentId: EstablishmentID,
		filterParams?: FilterParams
	): Promise<PromotionWithRelations[]>;
}
