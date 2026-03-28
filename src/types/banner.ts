import type { Prisma } from "@/generated/prisma/client.js";

import type { ResourceItem } from "./resource.js";

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
