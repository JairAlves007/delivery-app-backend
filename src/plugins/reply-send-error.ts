import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import { env } from "@/env.ts";
import { flattenError, ZodError } from "zod";
import type { DefaultErrorResponse } from "@/types/response.ts";
import { ErrorBase } from "@/errors/error-base.ts";
import { Prisma } from "@prisma/client";

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
				ApiResponse.error(error, flattenError(error).fieldErrors)
			);
		}

		if (error instanceof ErrorBase) {
			return this.status(error.statusCode).send(ApiResponse.error(error));
		}

		let errorCode: number = HTTPStatusCodes.INTERNAL_SERVER_ERROR;
		const errorResponse: DefaultErrorResponse = {
			success: false,
			message: "UNKNOWN_ERROR",
			details: {
				error: {
					message: "A unexpected error has occurred"
				}
			}
		};

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			errorResponse.message = "DATABASE_ERROR";

			switch (error.code) {
				case "P2002":
					const target = error.meta?.target as string[];
					const fields = target.join(", ");

					errorCode = HTTPStatusCodes.CONFLICT;
					errorResponse.details = {
						error: {
							message: `Já existe dados com este(s) campo(s): ${fields}`
						}
					};
					break;
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
