import { writeFile } from "node:fs/promises";
import path from "node:path";

import ejs from "ejs";

import { DigitalMenuNotFound } from "@/errors/digital-menu/digital-menu-not-found.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import {
  buildDigitalMenuFilePath,
  ensureDigitalMenuStorageDir,
  generateDigitalMenuFileKey,
  getDigitalMenuTemplatePath,
  removeDigitalMenuFile,
} from "@/helpers/digital-menu.js";
import type { IDigitalMenuRepository } from "@/interfaces/repositories/digital-menu-repository.js";
import { getBrowser } from "@/lib/puppeteer.js";
import type { GetEstablishmentThemeService } from "@/services/establishment-theme/get-establishment-theme-service.js";
import type { GenerateDigitalMenuJob } from "@/types/digital-menu.js";

import { mapDigitalMenuRenderData } from "./map-digital-menu-render-data.js";

export class GenerateDigitalMenuService {
  private digitalMenuRepository: IDigitalMenuRepository;
  private getEstablishmentThemeService: GetEstablishmentThemeService;

  constructor(
    digitalMenuRepository: IDigitalMenuRepository,
    getEstablishmentThemeService: GetEstablishmentThemeService,
  ) {
    this.digitalMenuRepository = digitalMenuRepository;
    this.getEstablishmentThemeService = getEstablishmentThemeService;
  }

  async handle({ establishmentId }: GenerateDigitalMenuJob): Promise<void> {
    await this.digitalMenuRepository.markProcessing(establishmentId);

    const [source, theme, previousMenu] = await Promise.all([
      this.digitalMenuRepository.findRenderSourceByEstablishmentId(
        establishmentId,
      ),
      this.getEstablishmentThemeService.handle(establishmentId),
      this.digitalMenuRepository.findByEstablishmentId(establishmentId),
    ]);

    if (!source) throw new DigitalMenuNotFound();

    const renderData = mapDigitalMenuRenderData({ source, theme });
    const html = await ejs.renderFile(
      getDigitalMenuTemplatePath(),
      renderData,
    );

    const browser = await getBrowser();
    const page = await browser.newPage();

    let pdfBuffer: Uint8Array;
    try {
      await page.setContent(html, { waitUntil: "load" });
      await page.waitForNetworkIdle({ idleTime: 200, timeout: 10_000 });
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });
    } finally {
      await page.close();
    }

    const fileKey = generateDigitalMenuFileKey();
    const filePath = buildDigitalMenuFilePath(establishmentId, fileKey);
    const storageDir = await ensureDigitalMenuStorageDir(establishmentId);

    await writeFile(path.join(storageDir, fileKey), pdfBuffer);

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
    //     Body: Buffer.from(pdfBuffer),
    //     ContentType: Constants.DIGITAL_MENU_MIME_TYPE,
    //   }),
    // );
    //
    // O file_path passaria a ser `menus/${establishmentId}/${fileKey}` e a
    // limpeza do arquivo antigo deve reusar enqueueDeleteR2Object do
    // resource-queue em vez de removeDigitalMenuFile.

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
