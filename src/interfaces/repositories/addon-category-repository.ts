import type { Prisma } from "@/generated/prisma/client.js";
import type { AddonCategoryFromRepository } from "@/types/addon-category.js";

import type { ICRUDBase } from "../crud-base.js";

export interface IAddonCategoryRepository extends ICRUDBase<
	AddonCategoryFromRepository,
	Prisma.AddonCategoryCreateInput,
	Prisma.AddonCategoryUpdateInput,
	number
> {}
