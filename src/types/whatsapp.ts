import type {
  OrderStatusType,
  WhatsappConnectionStatus,
} from "@/generated/prisma/client.js";
import type { EstablishmentID } from "@/types/establishment.js";

export type OrderStatusMessageContext = {
  customerName: string;
  orderId: string;
  orderTotal: string;
  orderCreatedAt: string;
};

export type SendWhatsappMessageJob = {
  establishmentId: EstablishmentID;
  orderStatus: OrderStatusType;
  recipientPhone: string;
  orderId?: string | null;
  body?: string | null;
  context?: OrderStatusMessageContext | null;
};

export type WhatsappTemplateVariables = {
  customerName: string;
  orderId: string;
  statusLabel: string;
  establishmentName: string;
  orderTotal: string;
  orderCreatedAt: string;
};

export type CreateInstanceProviderParams = {
  instanceName: string;
  webhookUrl: string;
};

export type CreateInstanceProviderResult = {
  instanceToken: string | null;
};

export type ConnectInstanceProviderParams = {
  instanceName: string;
  instanceToken?: string | null;
};

export type ConnectInstanceProviderResult = {
  qrCodeBase64: string | null;
  pairingCode: string | null;
  status: WhatsappConnectionStatus;
};

export type ConnectionStatusProviderResult = {
  status: WhatsappConnectionStatus;
  connectedNumber: string | null;
};

export type SendTextProviderParams = {
  instanceName: string;
  instanceToken?: string | null;
  recipient: string;
  text: string;
};

export type SendTextProviderResult = {
  providerMessageId: string | null;
  raw: unknown;
};

export type WhatsappWebhookData = {
  key?: {
    id?: string;
    remoteJid?: string;
    fromMe?: boolean;
  };
  keyId?: string;
  status?: string;
  state?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: { text?: string };
  };
};

export type WhatsappWebhookPayload = {
  event: string;
  instance: string;
  data?: WhatsappWebhookData;
};
