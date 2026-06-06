import { WhatsappConnectionStatus } from "@/generated/prisma/client.js";
import type { IWhatsappProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import type { IEstablishmentWhatsappIntegrationRepository } from "@/interfaces/repositories/establishment-whatsapp-integration-repository.js";
import type { EstablishmentID } from "@/types/establishment.js";

type GetEstablishmentWhatsappStatusRequest = {
  establishmentId: EstablishmentID;
};

type GetEstablishmentWhatsappStatusResponse = {
  instanceName: string;
  status: WhatsappConnectionStatus;
  connectedNumber: string | null;
};

export class GetEstablishmentWhatsappStatusService {
  private integrationRepository: IEstablishmentWhatsappIntegrationRepository;
  private whatsappProvider: IWhatsappProvider;

  constructor(
    integrationRepository: IEstablishmentWhatsappIntegrationRepository,
    whatsappProvider: IWhatsappProvider,
  ) {
    this.integrationRepository = integrationRepository;
    this.whatsappProvider = whatsappProvider;
  }

  async handle({
    establishmentId,
  }: GetEstablishmentWhatsappStatusRequest): Promise<GetEstablishmentWhatsappStatusResponse> {
    const integration =
      await this.integrationRepository.findByEstablishmentId(establishmentId);

    if (!integration)
      return {
        instanceName: "",
        status: WhatsappConnectionStatus.DISCONNECTED,
        connectedNumber: null,
      };

    const providerStatus = await this.whatsappProvider.getConnectionStatus({
      instanceName: integration.instance_name,
      instanceToken: integration.instance_token,
    });

    const connectedNumber =
      providerStatus.connectedNumber ?? integration.connected_number;

    await this.integrationRepository.updateStatus({
      establishmentId,
      status: providerStatus.status,
      connectedNumber,
    });

    return {
      instanceName: integration.instance_name,
      status: providerStatus.status,
      connectedNumber,
    };
  }
}
