import type { Prisma } from "@prisma/client";
import type { ResourceItem } from "./resource.ts";

export type BannerFromRepository = Prisma.BannerGetPayload<{
	include: {
		resources: {
			select: {
				resource: true;
			};
		};
	};
}>;

export type BannerList = Omit<BannerFromRepository, "resources"> & {
	resources: ResourceItem;
};
