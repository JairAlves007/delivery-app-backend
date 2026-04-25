import { Prisma } from "@/generated/prisma/client.js";

export type AddonFromRepository = Prisma.AddonGetPayload<{
  include: {
    category: true;
  };
}>;
