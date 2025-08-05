import { FastifyReply, FastifyRequest } from "fastify";

export const signIn = async (req: FastifyRequest, reply: FastifyReply) => {
	return reply.send({ success: true, message: "Sign-in route" }).code(200);
};
