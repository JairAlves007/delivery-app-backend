import type { FastifyInstance } from "fastify";

import { forgotPasswordRoute } from "./forgot-password.route.js";
import { meRoute } from "./me.route.js";
import { resetPasswordRoute } from "./reset-password.route.js";
import { signInRoute } from "./sign-in.route.js";
import { signUpRoute } from "./sign-up.route.js";

export const authRoutes = async (app: FastifyInstance) => {
  app.register(signInRoute);
  app.register(signUpRoute);
  app.register(forgotPasswordRoute);
  app.register(resetPasswordRoute);
  app.register(meRoute);
};
