import ejs from "ejs";

import { DigitalMenuNotFound } from "@/errors/digital-menu/digital-menu-not-found.js";
import { makeCache } from "@/factories/services/cache/make-cache.js";
import {
  buildDigitalMenuBucketKey,
  generateDigitalMenuFileKey,
  getDigitalMenuTemplatePath,
  putDigitalMenuObject,
} from "@/helpers/digital-menu.js";
import type { IDigitalMenuRepository } from "@/interfaces/repositories/digital-menu-repository.js";
import { getBrowser } from "@/lib/puppeteer.js";
import { enqueueDeleteR2Object } from "@/queues/resource-queue.js";
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
    const bucketKey = buildDigitalMenuBucketKey(establishmentId, fileKey);

    await putDigitalMenuObject({ bucketKey, body: pdfBuffer });

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
