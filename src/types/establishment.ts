import z from "zod";

import type { Prisma } from "@/generated/prisma/client.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import type { establishmentResponseSchema } from "@/schemas/response-schema.js";

export type EstablishmentFromRepository = Prisma.EstablishmentGetPayload<{
  include: {
    address: {
      select: {
        address: true;
      };
    };
    resources: {
      select: {
        resource: true;
      };
    };
    socialLinks: true;
    openingHours: true;
    closures: true;
  };
}>;

export type EstablishmentsList = z.infer<typeof establishmentResponseSchema>;

export type EstablishmentID = z.infer<typeof establishmentIdSchema>;
