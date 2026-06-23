/*
  Warnings:

  - A unique constraint covering the columns `[code,establishment_id]` on the table `coupons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CouponScopeType" AS ENUM ('ALL', 'PRODUCTS', 'CATEGORIES');

-- DropIndex
DROP INDEX "coupons_code_key";

-- AlterTable
ALTER TABLE "coupons" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "min_order_value" INTEGER,
ADD COLUMN     "per_customer_limit" INTEGER,
ADD COLUMN     "scope" "CouponScopeType" NOT NULL DEFAULT 'ALL';

-- CreateTable
CREATE TABLE "coupon_products" (
    "coupon_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "coupon_products_pkey" PRIMARY KEY ("coupon_id","product_id")
);

-- CreateTable
CREATE TABLE "coupon_categories" (
    "coupon_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "coupon_categories_pkey" PRIMARY KEY ("coupon_id","category_id")
);

-- CreateIndex
CREATE INDEX "idx_coupon_products_coupon_id" ON "coupon_products"("coupon_id");

-- CreateIndex
CREATE INDEX "idx_coupon_products_product_id" ON "coupon_products"("product_id");

-- CreateIndex
CREATE INDEX "idx_coupon_categories_coupon_id" ON "coupon_categories"("coupon_id");

-- CreateIndex
CREATE INDEX "idx_coupon_categories_category_id" ON "coupon_categories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_establishment_id_key" ON "coupons"("code", "establishment_id");

-- AddForeignKey
ALTER TABLE "coupon_products" ADD CONSTRAINT "coupon_products_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_products" ADD CONSTRAINT "coupon_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_categories" ADD CONSTRAINT "coupon_categories_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon_categories" ADD CONSTRAINT "coupon_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
