import type { FastifyInstance } from "fastify";

import { forgotPasswordRoute } from "./forgot-password.route.js";
import { logoutRoute } from "./logout.route.js";
import { meRoute } from "./me.route.js";
import { refreshTokenRoute } from "./refresh-token.route.js";
import { resetPasswordRoute } from "./reset-password.route.js";
import { signInRoute } from "./sign-in.route.js";
import { signUpRoute } from "./sign-up.route.js";
import { validateResetPasswordTokenRoute } from "./validate-reset-password-token.route.js";

export const authRoutes = async (app: FastifyInstance) => {
  app.register(signInRoute);
  app.register(signUpRoute);
  app.register(forgotPasswordRoute);
  app.register(resetPasswordRoute);
  app.register(validateResetPasswordTokenRoute);
  app.register(meRoute);
  app.register(refreshTokenRoute);
  app.register(logoutRoute);
};
