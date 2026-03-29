import type { Prisma } from "@/generated/prisma/client.js";
import type { AddonFromRepository } from "@/types/addon.js";

import type { ICRUDBase } from "../crud-base.js";

export type IAddonRepository = ICRUDBase<
	AddonFromRepository,
	Prisma.AddonCreateInput,
	Prisma.AddonUpdateInput,
	number
>;
