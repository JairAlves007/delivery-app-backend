import z from "zod";
import { addressLocationSchema } from "./generic-schema.ts";

export const updateAddressBodySchema = addressLocationSchema.partial();

export const addressParamsSchema = z.object({
	id: z.ulid().min(1, "O id do endereço deve ser preenchido")
});
