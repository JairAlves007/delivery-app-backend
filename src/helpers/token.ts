import { createHash } from "node:crypto";

export const computeLookupHash = (token: string): string =>
  createHash("sha256").update(token).digest("hex");
