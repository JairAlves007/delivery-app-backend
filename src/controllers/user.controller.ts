import Constants from "@/helpers/constants.ts";
import { ApiResponse } from "@/helpers/api.ts";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.ts";
import {
	adminSignInBodySchema,
	adminSignUpBodySchema,
	forgotPasswordBodySchema,
	resetPasswordBodySchema,
	signInBodySchema,
	signUpBodySchema
} from "@/schemas/auth-schema.ts";
import { RoleType } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { makeSignInService } from "@/factories/services/auth/make-sign-in-service.ts";
import { makeSignUpService } from "@/factories/services/auth/make-sign-up-service.ts";
import { makeForgotPasswordService } from "@/factories/services/auth/make-forgot-password-service.ts";
import { makeResetPasswordService } from "@/factories/services/auth/make-reset-password-service.ts";

export const signIn = (allowedRoles: RoleType[], isAdmin: boolean = false) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const schema = isAdmin ? adminSignInBodySchema : signInBodySchema;
		const body = schema.parse(request.body);

		try {
			const signInService = makeSignInService();

			const { user } = await signInService.handle({
				...body,
				allowedRoles
			});

			const token = await reply.jwtSign(
				{
					role: user.role.name,
					establishmentId: user.establishment?.owner_id
				},
				{
					sub: user.id
				}
			);

			return reply.status(HTTPStatusCodes.OK).send(
				ApiResponse.success("Usuário autenticado com sucesso", {
					type: Constants.TOKEN_TYPE,
					token
				})
			);
		} catch (error) {
			return reply.sendError(error);
		}
	};
};

export const signUp = (roleType: RoleType, isAdmin: boolean = false) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const schema = isAdmin ? adminSignUpBodySchema : signUpBodySchema;

		const body = schema.parse(request.body);

		try {
			const signUpService = makeSignUpService();

			const { user, role } = await signUpService.handle({
				...body,
				role: roleType
			});

			const token = await reply.jwtSign(
				{
					role
				},
				{
					sub: user.id
				}
			);

			if (request.user?.role === RoleType.ADMIN) {
				return reply
					.status(HTTPStatusCodes.CREATED)
					.send(ApiResponse.success("Usuário registrado com sucesso", {}));
			}

			return reply.status(HTTPStatusCodes.CREATED).send(
				ApiResponse.success("Usuário registrado com sucesso", {
					type: Constants.TOKEN_TYPE,
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
