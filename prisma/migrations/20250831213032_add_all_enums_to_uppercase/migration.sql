/*
  Warnings:

  - The values [Quantity,Selection] on the enum `AddonType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Shipping,Order] on the enum `CouponType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Delivery,Pickup] on the enum `DeliveryType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Percentage,Fixed] on the enum `DiscountType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Preparing,Shipped,Delivered,Cancelled] on the enum `OrderStatusType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Card,Money] on the enum `PaymentMethodType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Facebook,Instagram,Twitter,WhatsApp,TikTok] on the enum `SocialPlatform` will be removed. If these variants are still used in the database, this will fail.
  - The values [Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday] on the enum `WeekDay` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AddonType_new" AS ENUM ('QUANTITY', 'MULTIPLE_CHOICE');
ALTER TABLE "public"."addon_categories" ALTER COLUMN "type" TYPE "public"."AddonType_new" USING ("type"::text::"public"."AddonType_new");
ALTER TYPE "public"."AddonType" RENAME TO "AddonType_old";
ALTER TYPE "public"."AddonType_new" RENAME TO "AddonType";
DROP TYPE "public"."AddonType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."CouponType_new" AS ENUM ('SHIPPING', 'ORDER');
ALTER TABLE "public"."coupons" ALTER COLUMN "type" TYPE "public"."CouponType_new" USING ("type"::text::"public"."CouponType_new");
ALTER TYPE "public"."CouponType" RENAME TO "CouponType_old";
ALTER TYPE "public"."CouponType_new" RENAME TO "CouponType";
DROP TYPE "public"."CouponType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."DeliveryType_new" AS ENUM ('DELIVERY', 'PICKUP');
ALTER TABLE "public"."orders" ALTER COLUMN "delivery_type" TYPE "public"."DeliveryType_new" USING ("delivery_type"::text::"public"."DeliveryType_new");
ALTER TYPE "public"."DeliveryType" RENAME TO "DeliveryType_old";
ALTER TYPE "public"."DeliveryType_new" RENAME TO "DeliveryType";
DROP TYPE "public"."DeliveryType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."DiscountType_new" AS ENUM ('PERCENTAGE', 'FIXED');
ALTER TABLE "public"."coupons" ALTER COLUMN "discount_type" TYPE "public"."DiscountType_new" USING ("discount_type"::text::"public"."DiscountType_new");
ALTER TYPE "public"."DiscountType" RENAME TO "DiscountType_old";
ALTER TYPE "public"."DiscountType_new" RENAME TO "DiscountType";
DROP TYPE "public"."DiscountType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."OrderStatusType_new" AS ENUM ('PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."order_statuses" ALTER COLUMN "value" TYPE "public"."OrderStatusType_new" USING ("value"::text::"public"."OrderStatusType_new");
ALTER TYPE "public"."OrderStatusType" RENAME TO "OrderStatusType_old";
ALTER TYPE "public"."OrderStatusType_new" RENAME TO "OrderStatusType";
DROP TYPE "public"."OrderStatusType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentMethodType_new" AS ENUM ('CARD', 'PIX', 'MONEY');
ALTER TABLE "public"."orders" ALTER COLUMN "payment_method" TYPE "public"."PaymentMethodType_new" USING ("payment_method"::text::"public"."PaymentMethodType_new");
ALTER TYPE "public"."PaymentMethodType" RENAME TO "PaymentMethodType_old";
ALTER TYPE "public"."PaymentMethodType_new" RENAME TO "PaymentMethodType";
DROP TYPE "public"."PaymentMethodType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."SocialPlatform_new" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'TWITTER', 'WHATSAPP', 'TIKTOK');
ALTER TABLE "public"."social_links" ALTER COLUMN "platform" TYPE "public"."SocialPlatform_new" USING ("platform"::text::"public"."SocialPlatform_new");
ALTER TYPE "public"."SocialPlatform" RENAME TO "SocialPlatform_old";
ALTER TYPE "public"."SocialPlatform_new" RENAME TO "SocialPlatform";
DROP TYPE "public"."SocialPlatform_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."WeekDay_new" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');
ALTER TABLE "public"."opening_hours" ALTER COLUMN "day_of_week" TYPE "public"."WeekDay_new" USING ("day_of_week"::text::"public"."WeekDay_new");
ALTER TYPE "public"."WeekDay" RENAME TO "WeekDay_old";
ALTER TYPE "public"."WeekDay_new" RENAME TO "WeekDay";
DROP TYPE "public"."WeekDay_old";
COMMIT;
