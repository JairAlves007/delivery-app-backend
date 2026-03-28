import type { District, Prisma } from "@/generated/prisma/client.js";

import type { ICRUDBase } from "../crud-base.js";

export interface IDistrictRepository extends ICRUDBase<
	District,
	Prisma.DistrictCreateInput,
	Prisma.DistrictUpdateInput,
	string
> {}
