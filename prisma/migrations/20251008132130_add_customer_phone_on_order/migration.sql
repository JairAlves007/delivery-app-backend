/*
  Warnings:

  - Added the required column `customer_phone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "customer_phone" TEXT NOT NULL;
