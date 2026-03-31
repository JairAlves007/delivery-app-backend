import type { FastifyInstance } from "fastify";

import { generateUploadSignedUrlRoute } from "./generate-upload-signed-url.route.js";
import { getUploadResourceRulesRoute } from "./get-upload-resource-rules.route.js";

export const uploadRoutes = async (app: FastifyInstance) => {
	app.register(generateUploadSignedUrlRoute);
	app.register(getUploadResourceRulesRoute);
};
