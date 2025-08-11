import Constants from "@/helpers/constants";
import { makeSignInService } from "@/factories/services/make-sign-in-service";
import { makeSignUpService } from "@/factories/services/make-sign-up-service";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { signInBodySchema, signUpBodySchema } from "@/schemas/auth-schema";
import { RoleType } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { requestRoleSchema } from "@/schemas/request-role-schema";

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

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = signUpBodySchema.parse(request.body);
	const roleType = request.role;

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

		if (request.user.role === RoleType.ADMIN) {
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
