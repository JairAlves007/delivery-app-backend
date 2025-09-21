/*
  Warnings:

  - You are about to drop the column `user_id` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `delivery_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `delivery_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `coupon_id` on the `order_coupons` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `order_coupons` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `order_coupons` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_address_id` on the `order_delivery_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `order_delivery_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `customer_name` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `customer_phone` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `delivery_address_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_coupon_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `order_delivery_address_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `establishment_locations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_address_id,establishment_id]` on the table `delivery_addresses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `order_coupons` will be added. If there are existing duplicate values, this will fail.
  - Made the column `number` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_address_id` to the `delivery_addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount_value` to the `order_coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district_name` to the `order_delivery_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."delivery_addresses" DROP CONSTRAINT "delivery_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."delivery_addresses" DROP CONSTRAINT "delivery_addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."establishment_locations" DROP CONSTRAINT "establishment_locations_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_coupons" DROP CONSTRAINT "order_coupons_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_delivery_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_district_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_delivery_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_order_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_order_delivery_address_id_fkey";

-- DropIndex
DROP INDEX "public"."idx_addresses_user_id";

-- DropIndex
DROP INDEX "public"."delivery_addresses_user_id_address_id_establishment_id_key";

-- DropIndex
DROP INDEX "public"."idx_delivery_addresses_user_id";

-- DropIndex
DROP INDEX "public"."order_coupons_code_key";

-- DropIndex
DROP INDEX "public"."idx_order_items_order_id";

-- DropIndex
DROP INDEX "public"."idx_order_items_product_id";

-- DropIndex
DROP INDEX "public"."idx_orders_created_at";

-- DropIndex
DROP INDEX "public"."idx_orders_deleted_at";

-- DropIndex
DROP INDEX "public"."idx_orders_establishment_id";

-- DropIndex
DROP INDEX "public"."idx_orders_user_id";

-- AlterTable
ALTER TABLE "public"."addresses" DROP COLUMN "user_id",
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ALTER COLUMN "number" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."delivery_addresses" DROP COLUMN "address_id",
DROP COLUMN "user_id",
ADD COLUMN     "user_address_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."order_coupons" DROP COLUMN "coupon_id",
DROP COLUMN "type",
DROP COLUMN "value",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discount_value" INTEGER NOT NULL,
ALTER COLUMN "order_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."order_delivery_addresses" DROP COLUMN "delivery_address_id",
DROP COLUMN "user_id",
ADD COLUMN     "district_name" TEXT NOT NULL,
ALTER COLUMN "order_id" SET DATA TYPE TEXT,
ALTER COLUMN "address_id" DROP NOT NULL,
ALTER COLUMN "district_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."order_items" DROP COLUMN "customer_name",
DROP COLUMN "customer_phone",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "observation" TEXT;

-- AlterTable
ALTER TABLE "public"."orders" DROP COLUMN "delivery_address_id",
DROP COLUMN "order_coupon_id",
DROP COLUMN "order_delivery_address_id",
ADD COLUMN     "customer_name" TEXT,
ADD COLUMN     "customer_phone" TEXT;

-- DropTable
DROP TABLE "public"."establishment_locations";

-- CreateTable
CREATE TABLE "public"."user_addresses" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."establishment_addresses" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "establishment_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_addresses_user_id" ON "public"."user_addresses"("user_id");

-- CreateIndex
CREATE INDEX "idx_user_addresses_address_id" ON "public"."user_addresses"("address_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_addresses_user_id_address_id_key" ON "public"."user_addresses"("user_id", "address_id");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_addresses_establishment_id_key" ON "public"."establishment_addresses"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_establishment_addresses_deleted_at" ON "public"."establishment_addresses"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_establishment_addresses_establishment_id" ON "public"."establishment_addresses"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_establishment_addresses_address_id" ON "public"."establishment_addresses"("address_id");

-- CreateIndex
CREATE INDEX "idx_delivery_addresses_user_address_id" ON "public"."delivery_addresses"("user_address_id");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_addresses_user_address_id_establishment_id_key" ON "public"."delivery_addresses"("user_address_id", "establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_coupons_order_id_key" ON "public"."order_coupons"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_delivery_addresses_order_id" ON "public"."order_delivery_addresses"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_delivery_addresses_address_id" ON "public"."order_delivery_addresses"("address_id");

-- CreateIndex
CREATE INDEX "idx_order_delivery_addresses_district_id" ON "public"."order_delivery_addresses"("district_id");

-- AddForeignKey
ALTER TABLE "public"."order_coupons" ADD CONSTRAINT "order_coupons_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_addresses" ADD CONSTRAINT "user_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."establishment_addresses" ADD CONSTRAINT "establishment_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."establishment_addresses" ADD CONSTRAINT "establishment_addresses_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_user_address_id_fkey" FOREIGN KEY ("user_address_id") REFERENCES "public"."user_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
