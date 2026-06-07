/*
  Warnings:

  - You are about to drop the column `uses_per_user` on the `coupons` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'LOW_STOCK';

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "uses_per_user";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "low_stock_threshold" INTEGER;
