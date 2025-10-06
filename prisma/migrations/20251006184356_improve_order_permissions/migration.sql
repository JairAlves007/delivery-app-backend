/*
  Warnings:

  - The values [VIEW_OWN_ORDERS,CANCEL_OWN_ORDER,MANAGE_ORDERS] on the enum `PermissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PermissionType_new" AS ENUM ('VIEW_CATALOG', 'ADD_TO_CART', 'MANAGE_OWN_ADDRESSES', 'MANAGE_OWN_ORDERS', 'MANAGE_PRODUCTS', 'MANAGE_CATEGORIES', 'MANAGE_PRODUCT_OPTIONS', 'MANAGE_DISTRICTS', 'CANCEL_ORDERS', 'MANAGE_OWN_ESTABLISHMENT', 'MANAGE_BANNERS', 'MANAGE_COUPONS', 'VIEW_CUSTOMERS', 'MANAGE_ESTABLISHMENTS', 'MANAGE_USERS');
ALTER TABLE "permissions" ALTER COLUMN "name" TYPE "PermissionType_new" USING ("name"::text::"PermissionType_new");
ALTER TYPE "PermissionType" RENAME TO "PermissionType_old";
ALTER TYPE "PermissionType_new" RENAME TO "PermissionType";
DROP TYPE "public"."PermissionType_old";
COMMIT;
