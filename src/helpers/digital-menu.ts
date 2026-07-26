import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

import {
  GetObjectCommand,
  NoSuchKey,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import { env } from "@/env.js";
import Constants from "@/helpers/constants.js";
import { r2 } from "@/lib/cloudflare.js";

type PutDigitalMenuObjectParams = {
  bucketKey: string;
  body: Uint8Array;
};

type DigitalMenuObject = {
  stream: Readable;
  contentLength: number | null;
  etag: string | null;
};

export const generateDigitalMenuFileKey = (): string => {
  const uniqueString =
    Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

  return `${uniqueString}.pdf`;
};

export const buildDigitalMenuBucketKey = (
  establishmentId: string,
  fileKey: string,
): string => {
  return `${Constants.DIGITAL_MENU_BUCKET_PREFIX}/${establishmentId}/${fileKey}`;
};

export const buildDigitalMenuFileName = (slug: string): string => {
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");

  return `cardapio-${safeSlug}.pdf`;
};

export const putDigitalMenuObject = async ({
  bucketKey,
  body,
}: PutDigitalMenuObjectParams): Promise<void> => {
  await r2.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: bucketKey,
      Body: body,
      ContentType: Constants.DIGITAL_MENU_MIME_TYPE,
      CacheControl: Constants.DIGITAL_MENU_CACHE_CONTROL,
    }),
  );
};

export const getDigitalMenuObject = async (
  bucketKey: string,
): Promise<DigitalMenuObject | null> => {
  try {
    const result = await r2.send(
      new GetObjectCommand({
        Bucket: env.CLOUDFLARE_BUCKET_NAME,
        Key: bucketKey,
      }),
    );

    if (!(result.Body instanceof Readable)) return null;

    return {
      stream: result.Body,
      contentLength: result.ContentLength ?? null,
      etag: result.ETag ?? null,
    };
  } catch (error) {
    if (error instanceof NoSuchKey) return null;

    throw error;
  }
};

export const getDigitalMenuTemplatePath = (): string => {
  return fileURLToPath(
    new URL("../templates/menu/digital-menu.ejs", import.meta.url),
  );
};
