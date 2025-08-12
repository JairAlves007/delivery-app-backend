import Constants from "@/helpers/constants";
import { makeSignInService } from "@/factories/services/make-sign-in-service";
import { makeSignUpService } from "@/factories/services/make-sign-up-service";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { signInBodySchema, signUpBodySchema } from "@/schemas/auth-schema";
import { RoleType } from "@prisma/client";
import { makeProfileService } from "@/factories/services/make-get-profile-service";
import { FastifyRequest } from "fastify/types/request";
import { FastifyReply } from "fastify/types/reply";

export const signIn = (allowedRoles: RoleType[]) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const body = signInBodySchema.parse(request.body);

		try {
			const signInService = makeSignInService();

			const { user } = await signInService.handle({
				...body,
				allowedRoles
			});

			const token = await reply.jwtSign(
				{
					role: user.role.name
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

export const signUp = (roleType: RoleType) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const body = signUpBodySchema.parse(request.body);

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

export const me = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const getProfileService = makeProfileService();

		const profile = await getProfileService.handle({
			id: request.user.sub
		});

		return reply
			.status(HTTPStatusCodes.OK)
			.send(ApiResponse.success("Usuário listado com sucesso", profile));
	} catch (error) {
		return reply.sendError(error);
	}
};
