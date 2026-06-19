import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
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

const replySendErrorPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateReply("sendError", function (error: unknown) {
    if (env.NODE_ENV !== "production")
      fastify.log.error(error, "Unexpected error");

    if (error instanceof ZodError) {
      error.name = "VALIDATION_ERROR";

      return this.status(HTTPStatusCodes.UNPROCESSABLE_ENTITY).send(
        ApiResponse.error(error, beautifyValidationErrors(error)),
      );
    }

    if (hasZodFastifySchemaValidationErrors(error)) {
      return this.status(HTTPStatusCodes.UNPROCESSABLE_ENTITY).send({
        success: false,
        code: "VALIDATION_ERROR",
        details: {
          error: {
            message: "Erro de validação dos dados",
            issues: error.validation,
          },
        },
      });
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
          message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
        },
      },
    };

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      errorResponse.code = "DATABASE_ERROR";

      switch (error.code) {
        case "P2002": {
          errorCode = HTTPStatusCodes.CONFLICT;
          errorResponse.details = {
            error: {
              message:
                "Este registro já existe. Verifique os dados e tente novamente.",
            },
          };
          break;
        }
        case "P2025":
          errorCode = HTTPStatusCodes.NOT_FOUND;

          errorResponse.details = {
            error: {
              message: "Nenhuma informação encontrada",
            },
          };
          break;
      }

      return this.status(errorCode).send(errorResponse);
    }

    const frameworkError = error as {
      statusCode?: number;
      code?: string;
      details?: { error?: { message?: string } };
    } | null;
    const frameworkStatusCode = frameworkError?.statusCode;

    if (
      typeof frameworkStatusCode === "number" &&
      frameworkStatusCode >= 400 &&
      frameworkStatusCode < 500
    ) {
      const isRateLimit =
        frameworkStatusCode === HTTPStatusCodes.TOO_MANY_REQUESTS;

      const forwardedMessage =
        frameworkError?.details?.error?.message ??
        (error instanceof Error ? error.message : undefined);

      return this.status(frameworkStatusCode).send({
        success: false,
        code:
          frameworkError?.code ??
          (isRateLimit ? "RATE_LIMIT_ERROR" : "REQUEST_ERROR"),
        details: {
          error: {
            message:
              forwardedMessage ??
              (isRateLimit
                ? "Limite de requisições excedido. Tente novamente em instantes."
                : "Requisição inválida."),
          },
        },
      });
    }

    if (error instanceof Error) {
      error.name = "INTERNAL_SERVER";

      const safeError =
        env.NODE_ENV === "production"
          ? new Error("Ocorreu um erro inesperado. Tente novamente mais tarde.")
          : error;

      safeError.name = "INTERNAL_SERVER";

      return this.status(HTTPStatusCodes.INTERNAL_SERVER_ERROR).send(
        ApiResponse.error(safeError),
      );
    }

    return this.status(errorCode).send(errorResponse);
  });
};

export default fp(replySendErrorPlugin);
