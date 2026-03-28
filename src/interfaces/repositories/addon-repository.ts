import type { Prisma } from "@/generated/prisma/client.js";
import type { AddonFromRepository } from "@/types/addon.js";

import type { ICRUDBase } from "../crud-base.js";

export interface IAddonRepository extends ICRUDBase<
	AddonFromRepository,
	Prisma.AddonCreateInput,
	Prisma.AddonUpdateInput,
	number
> {}
