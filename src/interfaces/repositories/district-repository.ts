import type { District, Prisma } from "@/generated/prisma/client.js";

import type { ICRUDBase } from "../crud-base.js";

export type IDistrictRepository = ICRUDBase<
	District,
	Prisma.DistrictCreateInput,
	Prisma.DistrictUpdateInput,
	string
>;
