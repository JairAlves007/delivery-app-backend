/*
  Warnings:

  - You are about to drop the column `zip_code` on the `order_delivery_addresses` table. All the data in the column will be lost.
  - Added the required column `postal_code` to the `order_delivery_addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_delivery_addresses" DROP COLUMN "zip_code",
ADD COLUMN     "postal_code" TEXT NOT NULL,
ALTER COLUMN "number" DROP NOT NULL,
ALTER COLUMN "number" SET DEFAULT 'N/A';
