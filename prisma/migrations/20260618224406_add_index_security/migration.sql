-- DropIndex
DROP INDEX "idx_orders_created_at";

-- DropIndex
DROP INDEX "idx_orders_establishment_id";

-- DropIndex
DROP INDEX "idx_orders_scheduled_at";

-- DropIndex
DROP INDEX "idx_products_establishment_id";

-- CreateIndex
CREATE INDEX "idx_orders_establishment_created" ON "orders"("establishment_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_orders_establishment_scheduled" ON "orders"("establishment_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "idx_products_establishment_category" ON "products"("establishment_id", "category_id");
