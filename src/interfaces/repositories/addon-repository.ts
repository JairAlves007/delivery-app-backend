import type { Prisma } from "@/generated/prisma/client.ts";
import type { AddonFromRepository } from "@/types/addon.ts";
import type { ICRUDBase } from "../crud-base.ts";

export interface IAddonRepository extends ICRUDBase<
	AddonFromRepository,
	Prisma.AddonCreateInput,
	Prisma.AddonUpdateInput,
	number
> {}
