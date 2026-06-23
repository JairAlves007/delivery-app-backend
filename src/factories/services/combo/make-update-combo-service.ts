import { makeComboRepository } from "@/factories/repositories/make-combo-repository.js";
import { UpdateComboService } from "@/services/combo/update-combo-service.js";

export const makeUpdateComboService = () => {
  return new UpdateComboService(makeComboRepository());
};
