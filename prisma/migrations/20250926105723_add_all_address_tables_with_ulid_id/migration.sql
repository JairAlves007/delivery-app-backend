/*
  Warnings:

  - The primary key for the `delivery_addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `order_delivery_addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_addresses` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."delivery_addresses" DROP CONSTRAINT "delivery_addresses_user_address_id_fkey";

-- AlterTable
ALTER TABLE "public"."delivery_addresses" DROP CONSTRAINT "delivery_addresses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_address_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "delivery_addresses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "delivery_addresses_id_seq";

-- AlterTable
ALTER TABLE "public"."order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "order_delivery_addresses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "order_delivery_addresses_id_seq";

-- AlterTable
ALTER TABLE "public"."user_addresses" DROP CONSTRAINT "user_addresses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_addresses_id_seq";

-- AddForeignKey
ALTER TABLE "public"."delivery_addresses" ADD CONSTRAINT "delivery_addresses_user_address_id_fkey" FOREIGN KEY ("user_address_id") REFERENCES "public"."user_addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
