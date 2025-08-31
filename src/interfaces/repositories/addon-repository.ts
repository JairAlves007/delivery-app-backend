import type { Addon, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface IAddonRepository
	extends ICRUDBase<
		Addon,
		Prisma.AddonCreateInput,
		Prisma.AddonUpdateInput,
		number
	> {}
