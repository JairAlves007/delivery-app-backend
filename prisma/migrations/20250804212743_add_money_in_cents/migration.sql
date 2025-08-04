/*
  Warnings:

  - You are about to alter the column `price` on the `Addon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `value` on the `Coupon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `shippingCost` on the `District` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `changeAmount` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `shippingFee` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `subtotal` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `productPrice` on the `OrderItem` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `addonPrice` on the `OrderItemAddon` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "public"."Addon" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Coupon" ALTER COLUMN "value" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."District" ALTER COLUMN "shippingCost" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "changeAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "shippingFee" SET DATA TYPE INTEGER,
ALTER COLUMN "subtotal" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."OrderItem" ALTER COLUMN "productPrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."OrderItemAddon" ALTER COLUMN "addonPrice" SET DEFAULT 0,
ALTER COLUMN "addonPrice" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "price" SET DATA TYPE INTEGER;
