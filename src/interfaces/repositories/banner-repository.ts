import type { Prisma } from "@prisma/client";
import type { ICRUDBase } from "../crud-base.ts";
import type { BannerFromRepository } from "@/types/banner.ts";

export interface IBannerRepository
	extends ICRUDBase<
		BannerFromRepository,
		Prisma.BannerCreateInput,
		Prisma.BannerUpdateInput,
		number
	> {}
