import type { FastifyReply, FastifyRequest } from "fastify";

import { makeGenerateSignedUrlForUploadService } from "@/factories/services/upload/make-generate-signed-url-for-upload-service.js";
import { makeGetUploadResourceRulesService } from "@/factories/services/upload/make-get-upload-resource-rules-service.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	uploadResourceRulesQuerySchema,
	uploadSignedUrlBodySchema
} from "@/schemas/upload-schema.js";

export const generateUploadSignedUrl = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const body = uploadSignedUrlBodySchema.parse(request.body);

	try {
		const uploadSignedUrlService = makeGenerateSignedUrlForUploadService();

		const upload = await uploadSignedUrlService.handle(body);

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("URL gerada com sucesso", upload));
	} catch (error) {
		return reply.sendError(error);
	}
};

export const getUploadResourceRules = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const query = uploadResourceRulesQuerySchema.parse(request.query);

	try {
		const getUploadResourceRulesService = makeGetUploadResourceRulesService();

		const uploadRules = await getUploadResourceRulesService.handle(query);

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success("Regras de acesso obtidas com sucesso", uploadRules)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};
