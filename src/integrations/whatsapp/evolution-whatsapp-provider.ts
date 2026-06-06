import { WhatsappConnectionStatus } from "@/generated/prisma/client.js";
import type { IWhatsappProvider } from "@/interfaces/integrations/whatsapp-provider.js";
import { evolutionRequest } from "@/lib/evolution.js";
import type {
  ConnectInstanceProviderParams,
  ConnectInstanceProviderResult,
  ConnectionStatusProviderResult,
  CreateInstanceProviderParams,
  CreateInstanceProviderResult,
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
}
