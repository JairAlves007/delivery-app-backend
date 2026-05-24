import type { FastifyInstance } from "fastify";

import { createMyManualClosureRoute } from "./closure/create-my-manual-closure.route.js";
import { reopenMyEstablishmentRoute } from "./closure/reopen-my-establishment.route.js";
import { connectMyEstablishmentWhatsAppRoute } from "./connect-my-establishment-whatsapp.route.js";
import { createEstablishmentRoute } from "./create-establishment.route.js";
import { deleteEstablishmentRoute } from "./delete-establishment.route.js";
import { disconnectMyEstablishmentWhatsAppRoute } from "./disconnect-my-establishment-whatsapp.route.js";
import { findEstablishmentRoute } from "./find-establishment.route.js";
import { findMyEstablishmentRoute } from "./find-my-establishment.route.js";
import { findMyEstablishmentThemeRoute } from "./find-my-establishment-theme.route.js";
import { findMyEstablishmentWhatsAppRoute } from "./find-my-establishment-whatsapp.route.js";
import { listEstablishmentsRoute } from "./list-establishments.route.js";
import { listMyOrderStatusMessageTemplatesRoute } from "./list-my-order-status-message-templates.route.js";
import { updateEstablishmentRoute } from "./update-establishment.route.js";
import { updateMyEstablishmentRoute } from "./update-my-establishment.route.js";
import { updateMyEstablishmentThemeRoute } from "./update-my-establishment-theme.route.js";
import { upsertMyOrderStatusMessageTemplateRoute } from "./upsert-my-order-status-message-template.route.js";

export const establishmentRoutes = async (app: FastifyInstance) => {
	app.register(listEstablishmentsRoute);
	app.register(findEstablishmentRoute);
	app.register(findMyEstablishmentRoute);
	app.register(findMyEstablishmentThemeRoute);
	app.register(findMyEstablishmentWhatsAppRoute);
	app.register(createEstablishmentRoute);
	app.register(updateEstablishmentRoute);
	app.register(updateMyEstablishmentRoute);
	app.register(updateMyEstablishmentThemeRoute);
	app.register(deleteEstablishmentRoute);
	app.register(createMyManualClosureRoute);
	app.register(reopenMyEstablishmentRoute);
	app.register(connectMyEstablishmentWhatsAppRoute);
	app.register(disconnectMyEstablishmentWhatsAppRoute);
	app.register(listMyOrderStatusMessageTemplatesRoute);
	app.register(upsertMyOrderStatusMessageTemplateRoute);
};
