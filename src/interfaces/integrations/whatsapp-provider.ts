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
  checkNumberHasWhatsapp(
    params: CheckNumberProviderParams,
  ): Promise<CheckNumberProviderResult>;
  disconnectInstance(params: DisconnectInstanceProviderParams): Promise<void>;
}
