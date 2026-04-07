import z from "zod";

import { transformPriceToDatabase } from "@/helpers/price.js";

import { establishmentIdSchema } from "./generic-schema.js";

export const createDistrictBodySchema = z.object({
	name: z.string().trim().min(1, "O nome deve ser preenchido").max(255),
	shippingCost: z.coerce
		.number("O custo de entrega deve ser preenchido")
		.min(0, "O custo de entrega deve ser maior ou igual a zero")
		.finite()
		.transform(val => transformPriceToDatabase(val)),
	establishmentId: establishmentIdSchema
});

z.globalRegistry.add(createDistrictBodySchema, { id: "CreateDistrictBody" });

export const updateDistrictBodySchema = createDistrictBodySchema
	.partial()
	.extend({
		establishmentId: createDistrictBodySchema.shape.establishmentId
	});

z.globalRegistry.add(updateDistrictBodySchema, { id: "UpdateDistrictBody" });

export const districtParamsSchema = z.object({
	id: z.ulid("O id deve ser preenchido").min(1, "O id deve ser maior que zero")
});
