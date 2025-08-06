import { InvalidCredentials } from "@/errors/user/invalid-credentials-error";
import { UserPrismaRepository } from "@/repositories/user-prisma-repository";
import { adminSignInBodySchema } from "@/schemas/admin/auth/signInSchema";
import { SignInService } from "@/services/user/sign-in-service";
import { FastifyReply, FastifyRequest } from "fastify";

export const signIn = async (request: FastifyRequest, reply: FastifyReply) => {
	const { email, password } = adminSignInBodySchema.parse(request.body);

	try {
		const userRepository = new UserPrismaRepository();
		const signInService = new SignInService(userRepository);

		const { user, token } = await signInService.handle(email, password);

		return reply.status(200).send({
			success: true,
			message: "User signed in successfully",
			details: {
				type: "Bearer",
				token,
				user: {
					id: user.id,
					name: user.name,
					email: user.email
				}
			}
		});
	} catch (error) {
		if (error instanceof InvalidCredentials) {
			return reply.status(401).send({
				success: false,
				message: "Unauthorized",
				details: {
					error: {
						message: error.message
					}
				}
			});
		}

		throw error;
	}
};
