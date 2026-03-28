import type { FastifyReply, FastifyRequest } from "fastify";

import { makeForgotPasswordService } from "@/factories/services/auth/make-forgot-password-service.js";
import { makeResetPasswordService } from "@/factories/services/auth/make-reset-password-service.js";
import { makeSignInService } from "@/factories/services/auth/make-sign-in-service.js";
import { makeSignUpService } from "@/factories/services/auth/make-sign-up-service.js";
import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.js";
import { makeGetMenuService } from "@/factories/services/menu/make-get-menu-service.js";
import { RoleType } from "@/generated/prisma/client.js";
import { ApiResponse } from "@/helpers/api.js";
import Constants from "@/helpers/constants.js";
import { isEstablishmentOpen } from "@/helpers/establishment.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";
import {
	forgotPasswordBodySchema,
	resetPasswordBodySchema,
	signInBodySchema,
	signUpBodySchema
} from "@/schemas/auth-schema.js";

export const signIn = (allowedRoles: RoleType[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const body = signInBodySchema.parse(request.body);

		try {
			const signInService = makeSignInService();
			const menuService = makeGetMenuService();
			const findEstablishmentByIdService = makeFindEstablishmentByIdService();

			const { user, establishmentId } = await signInService.handle({
				...body,
				allowedRoles
			});

			const [establishment, menu] = await Promise.all([
				findEstablishmentByIdService.handle({ id: establishmentId }),
				menuService.handle(user.role.name, establishmentId)
			]);

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
					user: {
						id: user.id,
						name: user.name,
						email: user.email
					},
					establishment: {
						...establishment,
						isOpen: isEstablishmentOpen(establishment)
					},
					menu,
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
