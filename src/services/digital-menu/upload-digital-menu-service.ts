import { writeFile } from "node:fs/promises";
import path from "node:path";

import { InvalidDigitalMenuFile } from "@/errors/digital-menu/invalid-digital-menu-file.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import { DigitalMenuSource } from "@/generated/prisma/client.js";
import Constants from "@/helpers/constants.js";
import {
  buildDigitalMenuFilePath,
  ensureDigitalMenuStorageDir,
  generateDigitalMenuFileKey,
  removeDigitalMenuFile,
} from "@/helpers/digital-menu.js";
import type { IDigitalMenuRepository } from "@/interfaces/repositories/digital-menu-repository.js";

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
    const filePath = buildDigitalMenuFilePath(establishmentId, fileKey);
    const storageDir = await ensureDigitalMenuStorageDir(establishmentId);

    await writeFile(path.join(storageDir, fileKey), buffer);

    // TODO(R2): quando a entrega migrar para a Cloudflare, substituir a
    // escrita local acima pelo upload abaixo e remover o arquivo do disco.
    // import { PutObjectCommand } from "@aws-sdk/client-s3";
    // import { env } from "@/env.js";
    // import { r2 } from "@/lib/cloudflare.js";
    //
    // await r2.send(
    //   new PutObjectCommand({
    //     Bucket: env.CLOUDFLARE_BUCKET_NAME,
    //     Key: `menus/${establishmentId}/${fileKey}`,
    //     Body: buffer,
    //     ContentType: Constants.DIGITAL_MENU_MIME_TYPE,
    //   }),
    // );
    //
    // O file_path passaria a ser `menus/${establishmentId}/${fileKey}` e a
    // limpeza do arquivo antigo deve reusar enqueueDeleteR2Object do
    // resource-queue em vez de removeDigitalMenuFile.

    await this.digitalMenuRepository.upsert({
      establishmentId,
      source: DigitalMenuSource.UPLOADED,
    });
    await this.digitalMenuRepository.markReady({
      establishmentId,
      filePath,
      fileKey,
    });

    if (previousMenu?.file_path && previousMenu.file_path !== filePath)
      await removeDigitalMenuFile(previousMenu.file_path);

    const cache = makeCache();
    await cache.forgetKeysContaining(
      `${cache.keys.digitalMenu}_${establishmentId}`,
    );
  }
}
