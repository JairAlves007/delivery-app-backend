/*
  Warnings:

  - The values [MANAGE_OWN_STORE,MANAGE_STORES] on the enum `PermissionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PermissionType_new" AS ENUM ('VIEW_CATALOG', 'ADD_TO_CART', 'MANAGE_ADDRESSES', 'VIEW_OWN_ORDERS', 'CANCEL_OWN_ORDER', 'MANAGE_PRODUCTS', 'MANAGE_CATEGORIES', 'MANAGE_PRODUCT_OPTIONS', 'MANAGE_DISTRICTS', 'MANAGE_ORDERS', 'MANAGE_OWN_ESTABLISHMENT', 'MANAGE_BANNERS', 'MANAGE_COUPONS', 'VIEW_CUSTOMERS', 'MANAGE_ESTABLISHMENT', 'MANAGE_USERS');
ALTER TABLE "public"."permissions" ALTER COLUMN "name" TYPE "public"."PermissionType_new" USING ("name"::text::"public"."PermissionType_new");
ALTER TYPE "public"."PermissionType" RENAME TO "PermissionType_old";
ALTER TYPE "public"."PermissionType_new" RENAME TO "PermissionType";
DROP TYPE "public"."PermissionType_old";
COMMIT;
