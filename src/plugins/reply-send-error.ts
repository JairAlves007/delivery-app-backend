import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { ZodError } from "zod";

import { env } from "@/env.js";
import { ErrorBase } from "@/errors/error-base.js";
import { Prisma } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import { beautifyValidationErrors } from "@/helpers/validation-errors.js";
import type { DefaultErrorResponse } from "@/types/response.js";

declare module "fastify" {
	interface FastifyReply {
		sendError: (error: unknown) => FastifyReply;
	}
}

const replySendErrorPlugin: FastifyPluginAsync = async fastify => {
	fastify.decorateReply("sendError", function (error: unknown) {
		if (env.NODE_ENV !== "production")
			console.error("Unexpected error:", error);

		if (error instanceof ZodError) {
			error.name = "VALIDATION_ERROR";

			return this.status(HTTPStatusCodes.UNPROCESSABLE_ENTITY).send(
				ApiResponse.error(error, beautifyValidationErrors(error))
			);
		}

		if (error instanceof ErrorBase) {
			return this.status(error.statusCode).send(ApiResponse.error(error));
		}

		let errorCode: number = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
		const errorResponse: DefaultErrorResponse = {
			success: false,
			code: "UNKNOWN_ERROR",
			details: {
				error: {
					message: "A unexpected error has occurred"
				}
			}
		};

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			errorResponse.code = "DATABASE_ERROR";

			switch (error.code) {
				case "P2002": {
					const target = error.meta?.target as string[];
					const fields = target.join(", ");

					errorCode = HTTPStatusCodes.CONFLICT;
					errorResponse.details = {
						error: {
							message: `Já existe dados com este(s) campo(s): ${fields}`
						}
					};
					break;
				}
				case "P2025":
					errorCode = HTTPStatusCodes.NOT_FOUND;

					errorResponse.details = {
						error: {
							message: "Nenhuma informação encontrada"
						}
					};
					break;
			}

			return this.status(errorCode).send(errorResponse);
		}

		if (error instanceof Error) {
			error.name = "INTERNAL_SERVER";

			return this.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).send(
				ApiResponse.error(error)
			);
		}

		return this.status(errorCode).send(errorResponse);
	});
};

export default fp(replySendErrorPlugin);
