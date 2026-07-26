import type { Readable } from "node:stream";

import { DigitalMenuNotFound } from "@/errors/digital-menu/digital-menu-not-found.js";
import {
  buildDigitalMenuFileName,
  getDigitalMenuObject,
} from "@/helpers/digital-menu.js";
import type { IDigitalMenuRepository } from "@/interfaces/repositories/digital-menu-repository.js";

type ServeDigitalMenuParams = {
  slug: string;
};

type ServeDigitalMenuResult = {
  stream: Readable;
  fileName: string;
  contentLength: number | null;
  etag: string | null;
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

    const object = await getDigitalMenuObject(menu.file_path);

    if (!object) throw new DigitalMenuNotFound();

    return {
      stream: object.stream,
      fileName: buildDigitalMenuFileName(slug),
      contentLength: object.contentLength,
      etag: object.etag,
    };
  }
}
