import type { Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { AddonFromRepository } from "@/types/addon.ts";

export interface IAddonRepository
	extends ICRUDBase<
		AddonFromRepository,
		Prisma.AddonCreateInput,
		Prisma.AddonUpdateInput,
		number
	> {}
