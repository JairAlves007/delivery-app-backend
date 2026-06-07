import { NotificationType } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import type { IEstablishmentRepository } from "@/interfaces/repositories/establishment-repository.js";
import { createNotificationQueue } from "@/queues/notification-queue.js";

type CheckBillingDueNotificationsServiceResponse = {
  notifiedCount: number;
};

export class CheckBillingDueNotificationsService {
  private establishmentRepository: IEstablishmentRepository;

  constructor(establishmentRepository: IEstablishmentRepository) {
    this.establishmentRepository = establishmentRepository;
  }

  async handle(): Promise<CheckBillingDueNotificationsServiceResponse> {
    const target = new Date();
    target.setDate(target.getDate() + Constants.BILLING_DUE_DAYS_BEFORE);

    const start = new Date(target);
    start.setHours(0, 0, 0, 0);

    const end = new Date(target);
    end.setHours(23, 59, 59, 999);

    const establishments =
      await this.establishmentRepository.findBillingDueBetween({ start, end });

    for (const establishment of establishments) {
      const dueDateLabel = establishment.next_billing_date.toLocaleDateString(
        "pt-BR",
        { timeZone: Constants.DASHBOARD_TIMEZONE },
      );

      await createNotificationQueue({
        establishmentId: establishment.id,
        type: NotificationType.BILLING_DUE,
        title: "Fatura próxima do vencimento",
        description: `Sua fatura vence em ${dueDateLabel}. Realize o pagamento para manter o estabelecimento ativo.`,
        metadata: {
          nextBillingDate: establishment.next_billing_date.toISOString(),
        },
      });
    }

    return { notifiedCount: establishments.length };
  }
}
