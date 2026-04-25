import { establishmentIdSchema } from "@/schemas/generic-schema.js";

type UserScope = {
  primaryTenantId?: string | null;
  activeTenantId: string;
};

export const getUserEstablishmentId = (user: UserScope): string => {
  const parsed = establishmentIdSchema.safeParse(user.primaryTenantId);
  return parsed.success ? parsed.data : user.activeTenantId;
};
