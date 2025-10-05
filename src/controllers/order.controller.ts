import { makeCreateOrderService } from "@/factories/services/order/make-create-order-service.ts";
import { createOrderBodySchema } from "@/schemas/order-schema.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

export const index = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
	} catch (error) {
		return reply.sendError(error);
	}
};

export const find = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
	} catch (error) {
		return reply.sendError(error);
	}
};

export const store = async (request: FastifyRequest, reply: FastifyReply) => {
	const body = createOrderBodySchema.parse(request.body);

	try {
		const createOrderService = makeCreateOrderService();

		await createOrderService.handle({ ...body, userId: request.user.sub });
	} catch (error) {
		return reply.sendError(error);
	}
};

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
	} catch (error) {
		return reply.sendError(error);
	}
};

export const destroy = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
	} catch (error) {
		return reply.sendError(error);
	}
};
