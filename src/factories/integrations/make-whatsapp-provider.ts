import { EvolutionWhatsappProvider } from "@/integrations/whatsapp/evolution-whatsapp-provider.js";
import type { IWhatsappProvider } from "@/interfaces/integrations/whatsapp-provider.js";

export const makeWhatsappProvider = (): IWhatsappProvider => {
  return new EvolutionWhatsappProvider();
};
