import type { AddonCategory, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface IAddonCategoryRepository
	extends ICRUDBase<
		AddonCategory,
		Prisma.AddonCategoryCreateInput,
		Prisma.AddonCategoryUpdateInput,
		number
	> {}
