-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('MIN_ORDER_DISCOUNT', 'HAPPY_HOUR', 'BUY_X_PAY_Y', 'FREE_SHIPPING_THRESHOLD');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PermissionType" ADD VALUE 'MANAGE_PROMOTIONS';
ALTER TYPE "PermissionType" ADD VALUE 'MANAGE_COMBOS';
ALTER TYPE "PermissionType" ADD VALUE 'MANAGE_RECOMMENDATIONS';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ViewType" ADD VALUE 'VIEW_PROMOTIONS';
ALTER TYPE "ViewType" ADD VALUE 'VIEW_COMBOS';
ALTER TYPE "ViewType" ADD VALUE 'VIEW_RECOMMENDATIONS';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "promotion_discount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "promotions" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "type" "PromotionType" NOT NULL,
    "discount_type" "DiscountType",
    "value" DOUBLE PRECISION,
    "scope" "CouponScopeType" NOT NULL DEFAULT 'ALL',
    "min_order_value" INTEGER,
    "buy_quantity" INTEGER,
    "pay_quantity" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "stackable_with_coupon" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "starts_at" TIMESTAMPTZ,
    "ends_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_windows" (
    "id" SERIAL NOT NULL,
    "promotion_id" TEXT NOT NULL,
    "day_of_week" "WeekDay" NOT NULL,
    "opens_at" VARCHAR(5) NOT NULL,
    "closes_at" VARCHAR(5) NOT NULL,

    CONSTRAINT "promotion_windows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_products" (
    "promotion_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "promotion_products_pkey" PRIMARY KEY ("promotion_id","product_id")
);

-- CreateTable
CREATE TABLE "promotion_categories" (
    "promotion_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "promotion_categories_pkey" PRIMARY KEY ("promotion_id","category_id")
);

-- CreateTable
CREATE TABLE "order_promotions" (
    "id" SERIAL NOT NULL,
    "order_id" TEXT NOT NULL,
    "promotion_id" TEXT,
    "name" VARCHAR(255) NOT NULL,
    "type" "PromotionType" NOT NULL,
    "discount_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_promotions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_promotions_establishment_id" ON "promotions"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_promotions_deleted_at" ON "promotions"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_promotion_windows_promotion_id" ON "promotion_windows"("promotion_id");

-- CreateIndex
CREATE INDEX "idx_promotion_products_promotion_id" ON "promotion_products"("promotion_id");

-- CreateIndex
CREATE INDEX "idx_promotion_products_product_id" ON "promotion_products"("product_id");

-- CreateIndex
CREATE INDEX "idx_promotion_categories_promotion_id" ON "promotion_categories"("promotion_id");

-- CreateIndex
CREATE INDEX "idx_promotion_categories_category_id" ON "promotion_categories"("category_id");

-- CreateIndex
CREATE INDEX "idx_order_promotions_order_id" ON "order_promotions"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_promotions_promotion_id" ON "order_promotions"("promotion_id");

-- AddForeignKey
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_windows" ADD CONSTRAINT "promotion_windows_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_categories" ADD CONSTRAINT "promotion_categories_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_categories" ADD CONSTRAINT "promotion_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_promotions" ADD CONSTRAINT "order_promotions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_promotions" ADD CONSTRAINT "order_promotions_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
