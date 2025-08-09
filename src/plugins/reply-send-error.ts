import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { ApiResponse } from "@/helpers/api";
import { UserAlreadyExistsError } from "@/errors/user/user-already-exists-error";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import { InvalidCredentials } from "@/errors/user/invalid-credentials-error";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { env } from "@/env";
import { flattenError, ZodError } from "zod";
import { ErrorResponse } from "@/types/response";

declare module "fastify" {
	interface FastifyReply {
		sendError: (error: unknown) => FastifyReply;
	}
}

const replySendErrorPlugin: FastifyPluginAsync = async fastify => {
	fastify.decorateReply("sendError", function (error: unknown) {
		if (error instanceof ZodError) {
			error.name = "VALIDATION_ERROR";

			return this.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).send(
				ApiResponse.error(error, flattenError(error).fieldErrors)
			);
		}

		if (error instanceof UserAlreadyExistsError) {
			return this.status(HTTPStatusCodes.CONFLICT).send(
				ApiResponse.error(error)
			);
		}

		if (
			error instanceof UserUnauthorized ||
			error instanceof InvalidCredentials
		) {
			return this.status(HTTPStatusCodes.UNAUTHORIZED).send(
				ApiResponse.error(error)
			);
		}

		if (error instanceof Error) {
			error.name = "INTERNAL_SERVER";

			return this.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).send(
				ApiResponse.error(error)
			);
		}

		if (env.NODE_ENV !== "production")
			console.error("Unexpected error:", error);

		const errorResponse: ErrorResponse = {
			success: false,
			message: "UNKNOWN_ERROR",
			details: {
				error: {
					message: "A unexpected error has occurred"
				}
			}
		};

		return this.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).send(
			errorResponse
		);
	});
};

export default fp(replySendErrorPlugin);
