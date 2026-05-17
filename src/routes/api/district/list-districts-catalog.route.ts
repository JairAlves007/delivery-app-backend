import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

import { makeListDistrictService } from "@/factories/services/district/make-list-district-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { customerTags } from "@/http/swagger-tags.js";
import {
	apiDefaultErrorResponseSchema,
	apiSuccessResponseSchema,
	apiValidationErrorResponseSchema
} from "@/schemas/api-schema.js";
import { establishmentIdSchema } from "@/schemas/generic-schema.js";
import { districtListResponseSchema } from "@/schemas/response-schema.js";

export const listDistrictsCatalogRoute = async (app: FastifyInstance) => {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/:establishmentId/districts",
		{
			schema: {
				operationId: "listDistrictsCatalog",
				tags: customerTags("Districts"),
				summary: "Listar bairros",
				params: z.object({ establishmentId: establishmentIdSchema }),
				response: {
					200: apiSuccessResponseSchema(districtListResponseSchema),
					401: apiDefaultErrorResponseSchema,
					403: apiDefaultErrorResponseSchema,
					422: apiValidationErrorResponseSchema,
					500: apiDefaultErrorResponseSchema
				}
			}
		},
		async (request, reply) => {
			const { establishmentId } = request.params;

			const listDistrictService = makeListDistrictService();

			const districts = await listDistrictService.handle({
				perPage: 12,
				filterParams: {
					establishment_id: establishmentId
				}
			});

			return reply
				.status(HTTPStatusCodes.OK)
				.send(ApiResponse.success("Bairros listados com sucesso", districts));
		}
	);
};
