import { makeGenerateSignedUrlForUploadService } from "@/factories/services/upload/make-generate-signed-url-for-upload-service.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const generateUploadSignedUrl = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const body = uploadSignedUrlBodySchema.parse(request.body);

	try {
		const uploadSignedUrlService = makeGenerateSignedUrlForUploadService();

		const { signedUrl, fileKey } = await uploadSignedUrlService.handle(body);

		return reply.status(HTTPStatusCodes.OK).send(
			ApiResponse.success("URL gerada com sucesso", {
				signedUrl,
				fileKey
			})
		);
	} catch (error) {
		return reply.sendError(error);
	}
};
