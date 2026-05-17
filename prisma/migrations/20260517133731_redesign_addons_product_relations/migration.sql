/*
  Warnings:

  - You are about to drop the column `max_quantity` on the `addon_categories` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AddonPricingStrategy" AS ENUM ('SUM', 'MAX', 'AVERAGE', 'NONE');

-- CreateEnum
CREATE TYPE "ProductPricingMode" AS ENUM ('UNIT', 'PER_WEIGHT');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AddonType" ADD VALUE 'SINGLE_CHOICE';
ALTER TYPE "AddonType" ADD VALUE 'FRACTIONAL';

-- AlterTable
ALTER TABLE "addon_categories" DROP COLUMN "max_quantity",
ADD COLUMN     "parts_count" INTEGER,
ADD COLUMN     "pricing_strategy" "AddonPricingStrategy" NOT NULL DEFAULT 'SUM';

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "addons_subtotal" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "weight_grams" INTEGER;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "price_per_100g" INTEGER,
ADD COLUMN     "pricing_mode" "ProductPricingMode" NOT NULL DEFAULT 'UNIT';

-- CreateTable
CREATE TABLE "product_addon_categories" (
    "id" SERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "addon_category_id" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "min_selection" INTEGER,
    "max_selection" INTEGER,

    CONSTRAINT "product_addon_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_product_addon_categories_product_id" ON "product_addon_categories"("product_id");

-- CreateIndex
CREATE INDEX "idx_product_addon_categories_addon_category_id" ON "product_addon_categories"("addon_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_addon_categories_product_id_addon_category_id_key" ON "product_addon_categories"("product_id", "addon_category_id");

-- AddForeignKey
ALTER TABLE "product_addon_categories" ADD CONSTRAINT "product_addon_categories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_addon_categories" ADD CONSTRAINT "product_addon_categories_addon_category_id_fkey" FOREIGN KEY ("addon_category_id") REFERENCES "addon_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
