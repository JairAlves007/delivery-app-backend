import type {
  ConnectInstanceProviderParams,
  ConnectInstanceProviderResult,
  ConnectionStatusProviderResult,
  CreateInstanceProviderParams,
  CreateInstanceProviderResult,
  SendTextProviderParams,
  SendTextProviderResult,
} from "@/types/whatsapp.js";

export interface IWhatsappProvider {
  createInstance(
    params: CreateInstanceProviderParams,
  ): Promise<CreateInstanceProviderResult>;
  connect(
    params: ConnectInstanceProviderParams,
  ): Promise<ConnectInstanceProviderResult>;
  getConnectionStatus(
    params: ConnectInstanceProviderParams,
  ): Promise<ConnectionStatusProviderResult>;
  sendTextMessage(
    params: SendTextProviderParams,
  ): Promise<SendTextProviderResult>;
}
