import { makeForgotPasswordService } from "@/factories/services/auth/make-forgot-password-service.ts";
import { makeResetPasswordService } from "@/factories/services/auth/make-reset-password-service.ts";
import { makeSignInService } from "@/factories/services/auth/make-sign-in-service.ts";
import { makeSignUpService } from "@/factories/services/auth/make-sign-up-service.ts";
import { RoleType } from "@/generated/prisma/client.ts";
import { ApiResponse } from "@/helpers/api.ts";
import Constants from "@/helpers/constants.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	forgotPasswordBodySchema,
	resetPasswordBodySchema,
	signInBodySchema,
	signUpBodySchema
} from "@/schemas/auth-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const signIn = (allowedRoles: RoleType[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const body = signInBodySchema.parse(request.body);

		try {
			const signInService = makeSignInService();

			const { user, establishmentId } = await signInService.handle({
				...body,
				allowedRoles
			});

			const token = await reply.jwtSign(
				{
					role: user.role.name,
					activeTenantId: establishmentId,
					primaryTenantId: user.establishment?.id ?? null
				},
				{
					sub: user.id,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_TIME
				}
			);

			return reply.status(HTTPStatusCodes.OK).send(
				ApiResponse.success("Usuário autenticado com sucesso", {
					type: Constants.TOKEN_TYPE,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
					token
				})
			);
		} catch (error) {
			return reply.sendError(error);
		}
	};
};

export const signUp = (roleType: RoleType) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const body = signUpBodySchema.parse(request.body);

		try {
			const signUpService = makeSignUpService();

			const { user, role, establishmentId } = await signUpService.handle({
				...body,
				role: roleType
			});

			if (request.user?.role === RoleType.ADMIN) {
				return reply
					.status(HTTPStatusCodes.CREATED)
					.send(ApiResponse.success("Usuário registrado com sucesso", {}));
			}

			const token = await reply.jwtSign(
				{
					role,
					activeTenantId: establishmentId,
					primaryTenantId: null
				},
				{
					sub: user.id,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_TIME
				}
			);

			return reply.status(HTTPStatusCodes.CREATED).send(
				ApiResponse.success("Usuário registrado com sucesso", {
					type: Constants.TOKEN_TYPE,
					expiresIn: Constants.ACCESS_TOKEN_EXPIRATION_IN_SECONDS,
					token
				})
			);
		} catch (error) {
			return reply.sendError(error);
		}
	};
};

export const forgotPassword = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const { email } = forgotPasswordBodySchema.parse(request.body);

	try {
		const forgotPasswordService = makeForgotPasswordService();

		await forgotPasswordService.handle(email);

		return reply
			.status(HTTPStatusCodes.OK)
			.send(
				ApiResponse.success(
					"E-mail de recuperação na área! Corre lá na sua caixa pra conferir!",
					{}
				)
			);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const resetPassword = async (
	request: FastifyRequest,
	reply: FastifyReply
) => {
	const body = resetPasswordBodySchema.parse(request.body);

	try {
		const resetPasswordService = makeResetPasswordService();

		await resetPasswordService.handle(body);

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Senha alterada com sucesso", {}));
	} catch (error) {
		return reply.sendError(error);
	}
};
