/*
  Warnings:

  - You are about to drop the column `status` on the `addon_categories` table. All the data in the column will be lost.
  - Made the column `address_id` on table `order_delivery_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `district_id` on table `order_delivery_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customer_name` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `customer_phone` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_district_id_fkey";

-- AlterTable
ALTER TABLE "addon_categories" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "order_delivery_addresses" ALTER COLUMN "address_id" SET NOT NULL,
ALTER COLUMN "district_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "customer_name" SET NOT NULL,
ALTER COLUMN "customer_phone" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
