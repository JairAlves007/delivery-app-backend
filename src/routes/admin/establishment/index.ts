import type { FastifyInstance } from "fastify";

import { createManualClosureRoute } from "./closure/create-manual-closure.route.js";
import { createMyManualClosureRoute } from "./closure/create-my-manual-closure.route.js";
import { reopenEstablishmentRoute } from "./closure/reopen-establishment.route.js";
import { reopenMyEstablishmentRoute } from "./closure/reopen-my-establishment.route.js";
import { createEstablishmentRoute } from "./create-establishment.route.js";
import { deleteEstablishmentRoute } from "./delete-establishment.route.js";
import { findEstablishmentRoute } from "./find-establishment.route.js";
import { findMyEstablishmentRoute } from "./find-my-establishment.route.js";
import { listEstablishmentsRoute } from "./list-establishments.route.js";
import { updateEstablishmentRoute } from "./update-establishment.route.js";
import { updateMyEstablishmentRoute } from "./update-my-establishment.route.js";

export const establishmentRoutes = async (app: FastifyInstance) => {
	app.register(listEstablishmentsRoute);
	app.register(findEstablishmentRoute);
	app.register(findMyEstablishmentRoute);
	app.register(createEstablishmentRoute);
	app.register(updateEstablishmentRoute);
	app.register(updateMyEstablishmentRoute);
	app.register(deleteEstablishmentRoute);
	app.register(createMyManualClosureRoute);
	app.register(createManualClosureRoute);
	app.register(reopenMyEstablishmentRoute);
	app.register(reopenEstablishmentRoute);
};
