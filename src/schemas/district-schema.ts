import { transformPriceToDatabase } from "@/helpers/price.ts";
import z from "zod";

export const createDistrictBodySchema = z.object({
	name: z.string().min(1, "O nome deve ser preenchido"),
	shippingCost: z.coerce
		.number("O custo de entrega deve ser preenchido")
		.min(0, "O custo de entrega deve ser maior que zero")
		.transform(val => transformPriceToDatabase(val)),
	establishmentId: z
		.string()
		.min(1, "O id do estabelecimento deve ser preenchido")
});

export const updateDistrictBodySchema = createDistrictBodySchema
	.partial()
	.extend({
		establishmentId: createDistrictBodySchema.shape.establishmentId
	});

export const districtParamsSchema = z.object({
	id: z.coerce
		.number("O id deve ser preenchido")
		.min(1, "O id deve ser maior que zero")
});
