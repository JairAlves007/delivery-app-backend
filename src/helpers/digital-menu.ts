import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Constants from "@/helpers/constants.js";

export const generateDigitalMenuFileKey = (): string => {
  const uniqueString =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

  return `${uniqueString}.pdf`;
};

export const getDigitalMenuStorageDir = (establishmentId: string): string => {
  return path.resolve(
    process.cwd(),
    Constants.DIGITAL_MENU_STORAGE_DIR,
    establishmentId,
  );
};

export const buildDigitalMenuFilePath = (
  establishmentId: string,
  fileKey: string,
): string => {
  return path.join(
    Constants.DIGITAL_MENU_STORAGE_DIR,
    establishmentId,
    fileKey,
  );
};

export const resolveDigitalMenuAbsolutePath = (filePath: string): string => {
  return path.resolve(process.cwd(), filePath);
};

export const ensureDigitalMenuStorageDir = async (
  establishmentId: string,
): Promise<string> => {
  const dir = getDigitalMenuStorageDir(establishmentId);
  await mkdir(dir, { recursive: true });

  return dir;
};

export const removeDigitalMenuFile = async (
  filePath: string | null,
): Promise<void> => {
  if (!filePath) return;

  await rm(resolveDigitalMenuAbsolutePath(filePath), { force: true });
};

export const getDigitalMenuTemplatePath = (): string => {
  return fileURLToPath(
    new URL("../templates/menu/digital-menu.ejs", import.meta.url),
  );
};
