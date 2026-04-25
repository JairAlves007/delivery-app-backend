import type { FastifyInstance } from "fastify";

import { createAddressRoute } from "./create-address.route.js";
import { deleteAddressRoute } from "./delete-address.route.js";
import { findAddressRoute } from "./find-address.route.js";
import { listAddressesRoute } from "./list-addresses.route.js";
import { updateAddressRoute } from "./update-address.route.js";

export const addressRoutes = async (app: FastifyInstance) => {
  app.register(listAddressesRoute);
  app.register(findAddressRoute);
  app.register(createAddressRoute);
  app.register(updateAddressRoute);
  app.register(deleteAddressRoute);
};
