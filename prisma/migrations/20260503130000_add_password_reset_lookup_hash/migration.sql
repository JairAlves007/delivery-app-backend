-- Discard pending tokens (they are short-lived; affected users can request a new one)
DELETE FROM "password_reset_tokens"
WHERE "used_at" IS NULL AND "expires_at" > NOW();

ALTER TABLE "password_reset_tokens"
  ADD COLUMN "lookup_hash" VARCHAR(64);

CREATE UNIQUE INDEX "password_reset_tokens_lookup_hash_key"
  ON "password_reset_tokens" ("lookup_hash");
