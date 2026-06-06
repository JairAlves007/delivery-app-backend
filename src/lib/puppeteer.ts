import puppeteer, { type Browser } from "puppeteer";

let browser: Browser | null = null;

export const getBrowser = async (): Promise<Browser> => {
  if (browser?.connected) return browser;

  browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  return browser;
};

export const closeBrowser = async (): Promise<void> => {
  if (!browser) return;

  await browser.close();
  browser = null;
};
