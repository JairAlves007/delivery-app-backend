import type { z } from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import type { bannerResponseSchema } from "@/schemas/response-schema.js";

export type BannerFromRepository = Prisma.BannerGetPayload<{
	include: {
		resources: {
			select: {
				resource: true;
			};
		};
	};
}>;

export type BannerList = z.infer<typeof bannerResponseSchema>;
