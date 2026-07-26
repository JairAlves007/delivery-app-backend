import { WhatsappProviderError } from "@/errors/whatsapp/whatsapp-provider-error.js";
import { WhatsappConnectionStatus } from "@/generated/prisma/client.js";
import type { IWhatsappProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import { evolutionRequest } from "@/lib/evolution.js";
import type {
  CheckNumberProviderParams,
  CheckNumberProviderResult,
  ConnectInstanceProviderParams,
  ConnectInstanceProviderResult,
  ConnectionStatusProviderResult,
  CreateInstanceProviderParams,
  CreateInstanceProviderResult,
  DisconnectInstanceProviderParams,
  SendTextProviderParams,
  SendTextProviderResult,
} from "@/types/whatsapp.js";

type CreateInstanceResponse = {
  hash?: string | { apikey?: string };
  instance?: { instanceName?: string };
};

type ConnectResponse = {
  pairingCode?: string;
  code?: string;
  base64?: string;
};

type ConnectionStateResponse = {
  instance?: { instanceName?: string; state?: string };
};

type SendTextResponse = {
  key?: { id?: string; remoteJid?: string };
  status?: string;
};

type WhatsappNumbersResponse = Array<{
  exists?: boolean;
  jid?: string;
  number?: string;
}>;

const WEBHOOK_EVENTS = [
  "CONNECTION_UPDATE",
  "QRCODE_UPDATED",
  "MESSAGES_UPSERT",
  "MESSAGES_UPDATE",
];

const mapState = (state?: string): WhatsappConnectionStatus => {
  if (state === "open") return WhatsappConnectionStatus.CONNECTED;
  if (state === "connecting") return WhatsappConnectionStatus.CONNECTING;
  return WhatsappConnectionStatus.DISCONNECTED;
};

export class EvolutionWhatsappProvider implements IWhatsappProvider {
  async createInstance({
    instanceName,
    webhookUrl,
    webhookHeaders,
  }: CreateInstanceProviderParams): Promise<CreateInstanceProviderResult> {
    const data = await evolutionRequest<CreateInstanceResponse>({
      method: "POST",
      path: "/instance/create",
      body: {
        instanceName,
        integration: "WHATSAPP-BAILEYS",
        qrcode: true,
        groupsIgnore: true,
        webhook: {
          url: webhookUrl,
          byEvents: false,
          base64: true,
          events: WEBHOOK_EVENTS,
          headers: webhookHeaders,
        },
      },
    });

    const instanceToken =
      typeof data.hash === "string" ? data.hash : (data.hash?.apikey ?? null);

    return { instanceToken };
  }

  async connect({
    instanceName,
    instanceToken,
  }: ConnectInstanceProviderParams): Promise<ConnectInstanceProviderResult> {
    const data = await evolutionRequest<ConnectResponse>({
      method: "GET",
      path: `/instance/connect/${instanceName}`,
      apiKey: instanceToken,
    });

    return {
      qrCodeBase64: data.base64 ?? null,
      pairingCode: data.pairingCode ?? null,
      status: WhatsappConnectionStatus.CONNECTING,
    };
  }

  async getConnectionStatus({
    instanceName,
    instanceToken,
  }: ConnectInstanceProviderParams): Promise<ConnectionStatusProviderResult> {
    const data = await evolutionRequest<ConnectionStateResponse>({
      method: "GET",
      path: `/instance/connectionState/${instanceName}`,
      apiKey: instanceToken,
    });

    return {
      status: mapState(data.instance?.state),
      connectedNumber: null,
    };
  }

  async sendTextMessage({
    instanceName,
    instanceToken,
    recipient,
    text,
  }: SendTextProviderParams): Promise<SendTextProviderResult> {
    const data = await evolutionRequest<SendTextResponse>({
      method: "POST",
      path: `/message/sendText/${instanceName}`,
      apiKey: instanceToken,
      body: {
        number: recipient,
        text,
      },
    });

    return {
      providerMessageId: data.key?.id ?? null,
      raw: data,
    };
  }

  async checkNumberHasWhatsapp({
    instanceName,
    instanceToken,
    number,
  }: CheckNumberProviderParams): Promise<CheckNumberProviderResult> {
    const data = await evolutionRequest<WhatsappNumbersResponse>({
      method: "POST",
      path: `/chat/whatsappNumbers/${instanceName}`,
      apiKey: instanceToken,
      body: {
        numbers: [number],
      },
    });

    return { exists: data[0]?.exists === true };
  }

  async disconnectInstance({
    instanceName,
    instanceToken,
  }: DisconnectInstanceProviderParams): Promise<void> {
    await this.tolerate404(() =>
      evolutionRequest({
        method: "DELETE",
        path: `/instance/logout/${instanceName}`,
        apiKey: instanceToken,
      }),
    );

    await this.tolerate404(() =>
      evolutionRequest({
        method: "DELETE",
        path: `/instance/delete/${instanceName}`,
        apiKey: instanceToken,
      }),
    );
  }

  private tolerate404 = async (fn: () => Promise<unknown>): Promise<void> => {
    try {
      await fn();
    } catch (error) {
      if (error instanceof WhatsappProviderError && error.providerStatus === 404)
        return;

      throw error;
    }
  };
}
