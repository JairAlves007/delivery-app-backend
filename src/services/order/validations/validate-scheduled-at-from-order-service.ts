import { OrderSchedulingError } from "@/errors/order/scheduling-error.js";
import { makeFindEstablishmentByIdService } from "@/factories/services/establishment/make-find-establishment-by-id-service.js";
import Constants from "@/helpers/constants.js";
import { formatDateToHumanReadable } from "@/helpers/date.js";
import {
  hasConfiguredOpeningHours,
  isEstablishmentOpenAt,
} from "@/helpers/establishment.js";
import type { EstablishmentID } from "@/types/establishment.js";

type ValidateScheduledAtFromOrderServiceRequest = {
  establishmentId: EstablishmentID;
  scheduledAt?: string | null;
};

export class ValidateScheduledAtFromOrderService {
  async handle({
    establishmentId,
    scheduledAt,
  }: ValidateScheduledAtFromOrderServiceRequest): Promise<void> {
    const findEstablishmentByIdService = makeFindEstablishmentByIdService();
    const establishment = await findEstablishmentByIdService.handle({
      id: establishmentId,
    });

    const enforceOpeningHours = hasConfiguredOpeningHours(establishment);

    if (!scheduledAt) {
      if (enforceOpeningHours && !isEstablishmentOpenAt(establishment, new Date()))
        throw new OrderSchedulingError(
          establishment.accepts_scheduling
            ? "Estabelecimento fechado no momento. Agende seu pedido."
            : "Estabelecimento fechado no momento.",
        );

      return;
    }

    if (!establishment.accepts_scheduling)
      throw new OrderSchedulingError(
        "Este estabelecimento não aceita agendamento de pedidos.",
      );

    const scheduledDate = new Date(scheduledAt);

    if (Number.isNaN(scheduledDate.getTime()))
      throw new OrderSchedulingError("Data de agendamento inválida.");

    const now = new Date();

    if (scheduledDate.getTime() <= now.getTime())
      throw new OrderSchedulingError(
        "A data de agendamento deve ser no futuro.",
      );

    const maxDate = new Date(now);
    maxDate.setMonth(maxDate.getMonth() + Constants.SCHEDULING_WINDOW_MONTHS);

    if (scheduledDate.getTime() > maxDate.getTime())
      throw new OrderSchedulingError(
        `O agendamento deve ser em até ${Constants.SCHEDULING_WINDOW_MONTHS} meses.`,
      );

    if (enforceOpeningHours && !isEstablishmentOpenAt(establishment, scheduledDate))
      throw new OrderSchedulingError(
        `O estabelecimento não funciona em ${formatDateToHumanReadable(scheduledDate)}.`,
      );
  }
}
