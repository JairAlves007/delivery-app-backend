import { InvalidDigitalMenuFile } from "@/errors/digital-menu/invalid-digital-menu-file.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { DigitalMenuSource } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import {
  buildDigitalMenuBucketKey,
  generateDigitalMenuFileKey,
  putDigitalMenuObject,
} from "@/helpers/digital-menu.js";
import type { IDigitalMenuRepository } from "@/interfaces/repositories/digital-menu-repository.js";
import { enqueueDeleteR2Object } from "@/queues/resource-queue.js";

type UploadDigitalMenuParams = {
  establishmentId: string;
  fileBase64: string;
  mimeType: string;
};

const PDF_MAGIC_BYTES = "%PDF";

export class UploadDigitalMenuService {
  private digitalMenuRepository: IDigitalMenuRepository;

  constructor(digitalMenuRepository: IDigitalMenuRepository) {
    this.digitalMenuRepository = digitalMenuRepository;
  }

  async handle({
    establishmentId,
    fileBase64,
    mimeType,
  }: UploadDigitalMenuParams): Promise<void> {
    if (mimeType !== Constants.DIGITAL_MENU_MIME_TYPE)
      throw new InvalidDigitalMenuFile(
        "O arquivo do cardápio deve ser um PDF",
      );

    const buffer = Buffer.from(fileBase64, "base64");

    if (buffer.byteLength === 0)
      throw new InvalidDigitalMenuFile("O arquivo do cardápio está vazio");

    if (buffer.byteLength > Constants.DIGITAL_MENU_MAX_UPLOAD_BYTES)
      throw new InvalidDigitalMenuFile(
        "O arquivo do cardápio excede o tamanho máximo de 10MB",
      );

    if (buffer.subarray(0, 4).toString("utf8") !== PDF_MAGIC_BYTES)
      throw new InvalidDigitalMenuFile(
        "O arquivo do cardápio não é um PDF válido",
      );

    const previousMenu =
      await this.digitalMenuRepository.findByEstablishmentId(establishmentId);

    const fileKey = generateDigitalMenuFileKey();
    const bucketKey = buildDigitalMenuBucketKey(establishmentId, fileKey);

    await putDigitalMenuObject({ bucketKey, body: buffer });

    await this.digitalMenuRepository.upsert({
      establishmentId,
      source: DigitalMenuSource.UPLOADED,
    });
    await this.digitalMenuRepository.markReady({
      establishmentId,
      filePath: bucketKey,
      fileKey,
    });

    if (previousMenu?.file_path && previousMenu.file_path !== bucketKey)
      await enqueueDeleteR2Object({ bucketKey: previousMenu.file_path });

    const cache = makeCache();
    await cache.forgetKeysContaining(
      `${cache.keys.digitalMenu}_${establishmentId}`,
    );
  }
}
