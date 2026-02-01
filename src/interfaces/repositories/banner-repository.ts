import type { Prisma } from "@/generated/prisma/client.ts";
import type { BannerFromRepository } from "@/types/banner.ts";
import type { ICRUDBase } from "../crud-base.ts";

export interface IBannerRepository extends ICRUDBase<
	BannerFromRepository,
	Prisma.BannerCreateInput,
	Prisma.BannerUpdateInput,
	number
> {}
