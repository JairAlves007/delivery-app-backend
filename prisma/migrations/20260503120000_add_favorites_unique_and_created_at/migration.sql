-- Drop pre-existing duplicate (user_id, product_id) pairs, keeping the lowest id
DELETE FROM "favorites" f
USING "favorites" f2
WHERE f.user_id = f2.user_id
  AND f.product_id = f2.product_id
  AND f.id > f2.id;

-- Add created_at with default now() so existing rows get a value
ALTER TABLE "favorites"
  ADD COLUMN "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Enforce uniqueness so concurrent inserts can't create duplicates
CREATE UNIQUE INDEX "uq_favorites_user_product"
  ON "favorites" ("user_id", "product_id");
