import { makeEstablishmentRepository } from "@/factories/repositories/make-establishment-repository.js";
import { ListHubFiltersService } from "@/services/hub/list-hub-filters-service.js";

export const makeListHubFiltersService = () => {
  const establishmentRepository = makeEstablishmentRepository();
  return new ListHubFiltersService(establishmentRepository);
};
