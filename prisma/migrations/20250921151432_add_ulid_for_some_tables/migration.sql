/*
  Warnings:

  - The primary key for the `addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `districts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."delivery_addresses" DROP CONSTRAINT "delivery_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."delivery_addresses" DROP CONSTRAINT "delivery_addresses_district_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_district_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_statuses" DROP CONSTRAINT "order_statuses_order_id_fkey";

-- AlterTable
ALTER TABLE "public"."addresses" DROP CONSTRAINT "addresses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "addresses_id_seq";

-- AlterTable
ALTER TABLE "public"."delivery_addresses" ALTER COLUMN "address_id" SET DATA TYPE TEXT,
ALTER COLUMN "district_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."districts" DROP CONSTRAINT "districts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "districts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "districts_id_seq";

-- AlterTable
ALTER TABLE "public"."order_delivery_addresses" ALTER COLUMN "address_id" SET DATA TYPE TEXT,
ALTER COLUMN "district_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."order_items" ALTER COLUMN "order_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."order_statuses" ALTER COLUMN "order_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "orders_id_seq";

-- AddForeignKey
ALTER TABLE "public"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_statuses" ADD CONSTRAINT "order_statuses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
