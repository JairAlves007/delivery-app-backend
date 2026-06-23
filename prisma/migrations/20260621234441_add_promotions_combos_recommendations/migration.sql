-- CreateEnum
CREATE TYPE "RecommendationSource" AS ENUM ('MANUAL', 'AUTO');

-- CreateEnum
CREATE TYPE "ComboType" AS ENUM ('FIXED', 'BUILD_YOUR_OWN');

-- CreateTable
CREATE TABLE "product_recommendations" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "recommended_product_id" TEXT NOT NULL,
    "source" "RecommendationSource" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combos" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" VARCHAR(2000),
    "combo_type" "ComboType" NOT NULL,
    "price" INTEGER NOT NULL,
    "discount_percentage" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "valid_until" TIMESTAMPTZ,
    "order" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_items" (
    "id" SERIAL NOT NULL,
    "combo_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "combo_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_groups" (
    "id" TEXT NOT NULL,
    "combo_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "min_selection" INTEGER NOT NULL,
    "max_selection" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "combo_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_group_options" (
    "id" TEXT NOT NULL,
    "combo_group_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "additional_price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "combo_group_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "combo_resources" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "combo_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "combo_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combos" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "combo_id" TEXT,
    "combo_name" VARCHAR(255) NOT NULL,
    "combo_price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_combos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_combo_selections" (
    "id" SERIAL NOT NULL,
    "order_combo_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "additional_price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "order_combo_selections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_product_recommendations_establishment_id" ON "product_recommendations"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_product_recommendations_product_id" ON "product_recommendations"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_recommendations_product_id_recommended_product_id_key" ON "product_recommendations"("product_id", "recommended_product_id");

-- CreateIndex
CREATE INDEX "idx_combos_establishment_id" ON "combos"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_combos_deleted_at" ON "combos"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "combos_slug_establishment_id_key" ON "combos"("slug", "establishment_id");

-- CreateIndex
CREATE INDEX "idx_combo_items_combo_id" ON "combo_items"("combo_id");

-- CreateIndex
CREATE INDEX "idx_combo_items_product_id" ON "combo_items"("product_id");

-- CreateIndex
CREATE INDEX "idx_combo_groups_combo_id" ON "combo_groups"("combo_id");

-- CreateIndex
CREATE INDEX "idx_combo_group_options_combo_group_id" ON "combo_group_options"("combo_group_id");

-- CreateIndex
CREATE INDEX "idx_combo_group_options_product_id" ON "combo_group_options"("product_id");

-- CreateIndex
CREATE INDEX "idx_combo_resources_combo_id" ON "combo_resources"("combo_id");

-- CreateIndex
CREATE INDEX "idx_combo_resources_resource_id" ON "combo_resources"("resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "combo_resources_combo_id_resource_id_key" ON "combo_resources"("combo_id", "resource_id");

-- CreateIndex
CREATE INDEX "idx_order_combos_order_id" ON "order_combos"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_combos_combo_id" ON "order_combos"("combo_id");

-- CreateIndex
CREATE INDEX "idx_order_combo_selections_order_combo_id" ON "order_combo_selections"("order_combo_id");

-- CreateIndex
CREATE INDEX "idx_order_combo_selections_product_id" ON "order_combo_selections"("product_id");

-- AddForeignKey
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_recommendations" ADD CONSTRAINT "product_recommendations_recommended_product_id_fkey" FOREIGN KEY ("recommended_product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combos" ADD CONSTRAINT "combos_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_items" ADD CONSTRAINT "combo_items_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_items" ADD CONSTRAINT "combo_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_groups" ADD CONSTRAINT "combo_groups_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_group_options" ADD CONSTRAINT "combo_group_options_combo_group_id_fkey" FOREIGN KEY ("combo_group_id") REFERENCES "combo_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_group_options" ADD CONSTRAINT "combo_group_options_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_resources" ADD CONSTRAINT "combo_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "combo_resources" ADD CONSTRAINT "combo_resources_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combos" ADD CONSTRAINT "order_combos_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combos" ADD CONSTRAINT "order_combos_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "combos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_selections" ADD CONSTRAINT "order_combo_selections_order_combo_id_fkey" FOREIGN KEY ("order_combo_id") REFERENCES "order_combos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_combo_selections" ADD CONSTRAINT "order_combo_selections_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
