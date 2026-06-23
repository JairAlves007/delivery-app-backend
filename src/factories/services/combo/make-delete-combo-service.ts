import { makeComboRepository } from "@/factories/repositories/make-combo-repository.js";
import { DeleteComboService } from "@/services/combo/delete-combo-service.js";

export const makeDeleteComboService = () => {
  return new DeleteComboService(makeComboRepository());
};
