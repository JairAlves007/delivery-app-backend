/*
  Warnings:

  - You are about to drop the column `district_id` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `addonName` on the `order_item_addons` table. All the data in the column will be lost.
  - You are about to drop the column `addonPrice` on the `order_item_addons` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `couponId` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id,value]` on the table `order_statuses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `menus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addon_name` to the `order_item_addons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delivery_address_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_district_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_addressId_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_couponId_fkey";

-- DropIndex
DROP INDEX "public"."order_statuses_value_key";

-- AlterTable
ALTER TABLE "public"."addresses" DROP COLUMN "district_id";

-- AlterTable
ALTER TABLE "public"."menus" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."order_item_addons" DROP COLUMN "addonName",
DROP COLUMN "addonPrice",
ADD COLUMN     "addon_name" TEXT NOT NULL,
ADD COLUMN     "addon_price" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."order_items" DROP COLUMN "orderId",
ADD COLUMN     "order_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "addressId",
DROP COLUMN "couponId",
ADD COLUMN     "coupon_id" INTEGER,
ADD COLUMN     "delivery_address_id" INTEGER NOT NULL,
ADD COLUMN     "order_coupon_id" INTEGER,
ADD COLUMN     "order_delivery_address_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."delivery_addresses" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_delivery_addresses" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "address_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "delivery_address_id" INTEGER NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "shipping_cost" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_delivery_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_coupons" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" "public"."CouponType" NOT NULL,
    "discount_type" "public"."DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "coupon_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "order_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_delivery_addresses_user_id" ON "public"."delivery_addresses"("user_id");

-- CreateIndex
CREATE INDEX "idx_delivery_addresses_establishment_id" ON "public"."delivery_addresses"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_delivery_addresses_district_id" ON "public"."delivery_addresses"("district_id");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_addresses_user_id_address_id_establishment_id_key" ON "public"."delivery_addresses"("user_id", "address_id", "establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_delivery_addresses_order_id_key" ON "public"."order_delivery_addresses"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_coupons_code_key" ON "public"."order_coupons"("code");

-- CreateIndex
CREATE INDEX "idx_addresses_user_id" ON "public"."addresses"("user_id");

-- CreateIndex
CREATE INDEX "idx_addresses_deleted_at" ON "public"."addresses"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_coupons_establishment_id" ON "public"."coupons"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_coupons_deleted_at" ON "public"."coupons"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_favorites_user_id" ON "public"."favorites"("user_id");

-- CreateIndex
CREATE INDEX "idx_favorites_product_id" ON "public"."favorites"("product_id");

-- CreateIndex
CREATE INDEX "idx_order_item_addons_order_item_id" ON "public"."order_item_addons"("order_item_id");

-- CreateIndex
CREATE INDEX "idx_order_item_addons_addon_id" ON "public"."order_item_addons"("addon_id");

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "public"."order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_items_product_id" ON "public"."order_items"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_statuses_order_id_value_key" ON "public"."order_statuses"("order_id", "value");

-- CreateIndex
CREATE INDEX "idx_orders_user_id" ON "public"."orders"("user_id");

-- CreateIndex
CREATE INDEX "idx_orders_establishment_id" ON "public"."orders"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "public"."orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_orders_deleted_at" ON "public"."orders"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_role_permissions_role_id" ON "public"."role_permissions"("role_id");

-- CreateIndex
CREATE INDEX "idx_role_permissions_permission_id" ON "public"."role_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "idx_user_coupons_user_id" ON "public"."user_coupons"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_coupons_coupon_id" ON "public"."user_coupons"("coupon_id");

-- CreateIndex
CREATE INDEX "idx_users_role_id" ON "public"."users"("role_id");

-- CreateIndex
CREATE INDEX "idx_users_deleted_at" ON "public"."users"("deleted_at");

-- AddForeignKey
ALTER TABLE "public"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "public"."delivery_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_order_coupon_id_fkey" FOREIGN KEY ("order_coupon_id") REFERENCES "public"."order_coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_order_delivery_address_id_fkey" FOREIGN KEY ("order_delivery_address_id") REFERENCES "public"."order_delivery_addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_delivery_address_id_fkey" FOREIGN KEY ("delivery_address_id") REFERENCES "public"."delivery_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_coupons" ADD CONSTRAINT "order_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
