import { ErrorBase } from "@/errors/error-base.js";
import { HTTPStatusCodes } from "@/helpers/http-request-codes.js";

export class WhatsappProviderError extends ErrorBase {
  public readonly providerStatus: number | null;

  constructor(
    message = "Falha na comunicação com o provedor de WhatsApp",
    providerStatus: number | null = null,
  ) {
    super(message, HTTPStatusCodes.BAD_GATEWAY, "WHATSAPP_PROVIDER_ERROR");
    this.providerStatus = providerStatus;
  }
}
