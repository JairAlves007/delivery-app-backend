import Constants from "@/helpers/constants";
import { makeSignInService } from "@/factories/services/make-sign-in-service";
import { makeSignUpService } from "@/factories/services/make-sign-up-service";
import { ApiResponse } from "@/helpers/api";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import { signInBodySchema, signUpBodySchema } from "@/schemas/auth-schema";
import { RoleType } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { requestRoleSchema } from "@/schemas/request-role-schema";

export const signIn = async (
	request: FastifyRequest,
	reply: FastifyReply,
	allowedRoles: RoleType[]
) => {
	const body = signInBodySchema.parse(request.body);

	try {
		const signInService = makeSignInService();

		const { user, token } = await signInService.handle({
			...body,
			allowedRoles
		});

		return reply.status(HTTPStatusCodes.OK).send(
			ApiResponse.success("User signed in successfully", {
				type: Constants.TOKEN_TYPE,
				token,
				user: {
					id: user.id,
					name: user.name,
					email: user.email
				}
			})
		);
	} catch (error) {
		return reply.sendError(error);
	}
};

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = signUpBodySchema.parse(request.body);
	const roleType = requestRoleSchema.parse(request.role);

	try {
		const signUpService = makeSignUpService();

		const { token } = await signUpService.handle({
			...body,
			roleType
		});

		if (request.user?.roleType === RoleType.ADMIN) {
			return reply
				.status(HTTPStatusCodes.CREATED)
				.send(ApiResponse.success("User signed up successfully", {}));
		}

		return reply.status(HTTPStatusCodes.CREATED).send(
			ApiResponse.success("User signed up successfully", {
				type: Constants.TOKEN_TYPE,
				token
			})
		);
	} catch (error) {
		return reply.sendError(error);
	}
};
