import type { Prisma } from "@/generated/prisma/client.ts";
import type { AddonCategoryFromRepository } from "@/types/addon-category.ts";
import type { ICRUDBase } from "../crud-base.ts";

export interface IAddonCategoryRepository extends ICRUDBase<
	AddonCategoryFromRepository,
	Prisma.AddonCategoryCreateInput,
	Prisma.AddonCategoryUpdateInput,
	number
> {}
