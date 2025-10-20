import type { AddonCategoryFromRepository } from "@/types/addon-category.ts";
import type { Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface IAddonCategoryRepository
	extends ICRUDBase<
		AddonCategoryFromRepository,
		Prisma.AddonCategoryCreateInput,
		Prisma.AddonCategoryUpdateInput,
		number
	> {}
