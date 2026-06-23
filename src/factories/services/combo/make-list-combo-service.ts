import { makeComboRepository } from "@/factories/repositories/make-combo-repository.js";
import { ListComboService } from "@/services/combo/list-combo-service.js";

export const makeListComboService = () => {
  return new ListComboService(makeComboRepository());
};
