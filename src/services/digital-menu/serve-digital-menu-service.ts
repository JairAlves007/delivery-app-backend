import { access } from "node:fs/promises";

import { DigitalMenuNotFound } from "@/errors/digital-menu/digital-menu-not-found.js";
import { resolveDigitalMenuAbsolutePath } from "@/helpers/digital-menu.js";
import type { IDigitalMenuRepository } from "@/interfaces/repositories/digital-menu-repository.js";

type ServeDigitalMenuParams = {
  slug: string;
};

type ServeDigitalMenuResult = {
  absolutePath: string;
  fileName: string;
};

export class ServeDigitalMenuService {
  private digitalMenuRepository: IDigitalMenuRepository;

  constructor(digitalMenuRepository: IDigitalMenuRepository) {
    this.digitalMenuRepository = digitalMenuRepository;
  }

  async handle({
    slug,
  }: ServeDigitalMenuParams): Promise<ServeDigitalMenuResult> {
    const menu =
      await this.digitalMenuRepository.findReadyByEstablishmentSlug(slug);

    if (!menu?.file_path) throw new DigitalMenuNotFound();

    // TODO(R2): quando o arquivo estiver na Cloudflare, em vez de servir o
    // arquivo local basta redirecionar para a URL pública:
    // return { redirectUrl: `${env.PUBLIC_BUCKET_URL}/${menu.file_path}` };

    const absolutePath = resolveDigitalMenuAbsolutePath(menu.file_path);

    try {
      await access(absolutePath);
    } catch {
      throw new DigitalMenuNotFound();
    }

    return {
      absolutePath,
      fileName: `cardapio-${slug}.pdf`,
    };
  }
}
