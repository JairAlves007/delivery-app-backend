import { makeComboRepository } from "@/factories/repositories/make-combo-repository.js";
import { ListActiveCombosService } from "@/services/combo/list-active-combos-service.js";

export const makeListActiveCombosService = () => {
  return new ListActiveCombosService(makeComboRepository());
};
