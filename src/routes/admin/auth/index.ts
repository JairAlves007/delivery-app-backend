import type { FastifyInstance } from "fastify";

import { signInRoute } from "./sign-in.route.js";
import { signUpRoute } from "./sign-up.route.js";

export const adminAuthRoutes = async (app: FastifyInstance) => {
	app.register(signInRoute);
	app.register(signUpRoute);
};
