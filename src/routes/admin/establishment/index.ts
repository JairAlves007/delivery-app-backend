import type { FastifyInstance } from "fastify";

import { createEstablishmentRoute } from "./create-establishment.route.js";
import { deleteEstablishmentRoute } from "./delete-establishment.route.js";
import { findEstablishmentRoute } from "./find-establishment.route.js";
import { listEstablishmentsRoute } from "./list-establishments.route.js";
import { updateEstablishmentRoute } from "./update-establishment.route.js";

export const establishmentRoutes = async (app: FastifyInstance) => {
	app.register(listEstablishmentsRoute);
	app.register(findEstablishmentRoute);
	app.register(createEstablishmentRoute);
	app.register(updateEstablishmentRoute);
	app.register(deleteEstablishmentRoute);
};
