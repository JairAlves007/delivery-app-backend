import { makeGenerateSignedUrlForUploadService } from "@/factories/services/make-generate-signed-url-for-upload-service";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { uploadSignedUrlBodySchema } from "@/schemas/upload-schema";
import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";

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
