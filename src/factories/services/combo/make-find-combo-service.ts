import { makeComboRepository } from "@/factories/repositories/make-combo-repository.js";
import { FindComboService } from "@/services/combo/find-combo-service.js";

export const makeFindComboService = () => {
  return new FindComboService(makeComboRepository());
};
