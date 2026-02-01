import type { District, Prisma } from "@/generated/prisma/client.ts";
import type { ICRUDBase } from "../crud-base.ts";

export interface IDistrictRepository extends ICRUDBase<
	District,
	Prisma.DistrictCreateInput,
	Prisma.DistrictUpdateInput,
	string
> {}
