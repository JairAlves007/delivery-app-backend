import type { Banner, Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";

export interface IBannerRepository
	extends ICRUDBase<
		Banner,
		Prisma.BannerCreateInput,
		Prisma.BannerUpdateInput,
		number
	> {}
