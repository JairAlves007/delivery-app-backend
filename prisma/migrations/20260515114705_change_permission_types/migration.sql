/*
  Warnings:

  - The values [CANCEL_ORDERS,VIEW_CUSTOMERS,MANAGE_USERS] on the enum `PermissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PermissionType_new" AS ENUM ('MANAGE_PRODUCTS', 'MANAGE_CATEGORIES', 'MANAGE_PRODUCT_OPTIONS', 'MANAGE_DISTRICTS', 'MANAGE_ORDERS', 'MANAGE_OWN_ESTABLISHMENT', 'MANAGE_BANNERS', 'MANAGE_COUPONS', 'MANAGE_ESTABLISHMENTS', 'MANAGE_ESTABLISHMENT_OWNERS', 'VIEW_DASHBOARD');
ALTER TABLE "permissions" ALTER COLUMN "name" TYPE "PermissionType_new" USING ("name"::text::"PermissionType_new");
ALTER TYPE "PermissionType" RENAME TO "PermissionType_old";
ALTER TYPE "PermissionType_new" RENAME TO "PermissionType";
DROP TYPE "public"."PermissionType_old";
COMMIT;
