import type { FastifyInstance } from "fastify";

import { createEstablishmentOwnerRoute } from "./create-establishment-owner.route.js";
import { deleteEstablishmentOwnerRoute } from "./delete-establishment-owner.route.js";
import { findEstablishmentOwnerRoute } from "./find-establishment-owner.route.js";
import { listEstablishmentOwnersRoute } from "./list-establishment-owners.route.js";
import { updateEstablishmentOwnerRoute } from "./update-establishment-owner.route.js";

export const establishmentOwnerRoutes = async (app: FastifyInstance) => {
	app.register(listEstablishmentOwnersRoute);
	app.register(findEstablishmentOwnerRoute);
	app.register(createEstablishmentOwnerRoute);
	app.register(updateEstablishmentOwnerRoute);
	app.register(deleteEstablishmentOwnerRoute);
};
