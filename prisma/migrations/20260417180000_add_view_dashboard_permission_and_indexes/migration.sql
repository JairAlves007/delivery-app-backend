-- AlterEnum
ALTER TYPE "PermissionType" ADD VALUE 'VIEW_DASHBOARD';

-- Indexes to accelerate dashboard aggregations
CREATE INDEX IF NOT EXISTS "idx_orders_establishment_created_at"
  ON "orders" ("establishment_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_order_statuses_order_created_desc"
  ON "order_statuses" ("order_id", "created_at" DESC);
