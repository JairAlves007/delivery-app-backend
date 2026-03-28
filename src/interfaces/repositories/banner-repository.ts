import type { Prisma } from "@/generated/prisma/client.js";
import type { BannerFromRepository } from "@/types/banner.js";

import type { ICRUDBase } from "../crud-base.js";

export interface IBannerRepository extends ICRUDBase<
	BannerFromRepository,
	Prisma.BannerCreateInput,
	Prisma.BannerUpdateInput,
	number
> {}
