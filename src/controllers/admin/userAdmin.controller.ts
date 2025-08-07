import { InvalidCredentials } from "@/errors/user/invalid-credentials-error";
import { UserAlreadyExistsError } from "@/errors/user/user-already-exists-error";
import { UserUnauthorized } from "@/errors/user/user-unauthorized";
import { makeSignInService } from "@/factories/make-sign-in-service";
import { makeSignUpService } from "@/factories/make-sign-up-service";
import { ApiResponse } from "@/helpers/api";
import Constants from "@/helpers/constants";
import { HTTPStatusCodes } from "@/helpers/http-request-codes";
import {
	signInBodySchema,
	signUpBodySchema
} from "@/schemas/admin/auth/authSchema";
import { FastifyReply, FastifyRequest } from "fastify";

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = signInBodySchema.parse(request.body);

	try {
		const signInService = makeSignInService();

		const { user, token } = await signInService.handle(body);

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
		if (error instanceof InvalidCredentials) {
			return reply
				.status(HTTPStatusCodes.UNAUTHORIZED)
				.send(ApiResponse.error(error));
		}

		throw error;
	}
};

export const signUp = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = signUpBodySchema.parse(request.body);

	try {
		const signUpService = makeSignUpService();

		const { token } = await signUpService.handle({
			...body,
			role: request.role
		});

		return reply.status(HTTPStatusCodes.CREATED).send(
			ApiResponse.success("User signed up successfully", {
				type: Constants.TOKEN_TYPE,
				token
			})
		);
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			return reply
				.status(HTTPStatusCodes.CONFLICT)
				.send(ApiResponse.error(error));
		}

		if (error instanceof UserUnauthorized) {
			return reply
				.status(HTTPStatusCodes.UNAUTHORIZED)
				.send(ApiResponse.error(error));
		}

		throw error;
	}
};
