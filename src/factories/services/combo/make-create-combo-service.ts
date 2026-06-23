import { makeComboRepository } from "@/factories/repositories/make-combo-repository.js";
import { CreateComboService } from "@/services/combo/create-combo-service.js";

export const makeCreateComboService = () => {
  return new CreateComboService(makeComboRepository());
};
