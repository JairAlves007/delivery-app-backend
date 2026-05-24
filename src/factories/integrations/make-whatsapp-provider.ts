import { EvolutionWhatsAppProvider } from "@/integrations/whatsapp/evolution-whatsapp-provider.js";
import type { IWhatsAppProvider } from "@/interfaces/integrations/whatsapp-provider.js";

let singleton: IWhatsAppProvider | null = null;

export const makeWhatsAppProvider = (): IWhatsAppProvider => {
	if (!singleton) {
		singleton = new EvolutionWhatsAppProvider();
	}
	return singleton;
};
