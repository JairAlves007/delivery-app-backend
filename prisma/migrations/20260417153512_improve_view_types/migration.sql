/*
  Warnings:

  - The values [CREATE_ESTABLISHMENT,CREATE_PRODUCT,CREATE_PRODUCT_CATEGORY,CREATE_COUPON] on the enum `ViewType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ViewType_new" AS ENUM ('VIEW_DASHBOARD', 'VIEW_CATALOG', 'VIEW_OWN_BAG', 'VIEW_OWN_FAVORITES', 'MAKE_OWN_ORDER', 'VIEW_OWN_ORDERS', 'VIEW_OWN_ADDRESSES', 'CREATE_OWN_ADDRESS', 'VIEW_ESTABLISHMENTS', 'VIEW_CUSTOMERS', 'CREATE_ESTABLISHMENT_OWNER', 'VIEW_PRODUCTS', 'VIEW_ADDONS', 'VIEW_ADDON_CATEGORIES', 'VIEW_PRODUCT_CATEGORIES', 'VIEW_ORDERS', 'VIEW_COUPONS');
ALTER TABLE "menus" ALTER COLUMN "view_type" TYPE "ViewType_new" USING ("view_type"::text::"ViewType_new");
ALTER TABLE "submenus" ALTER COLUMN "view_type" TYPE "ViewType_new" USING ("view_type"::text::"ViewType_new");
ALTER TYPE "ViewType" RENAME TO "ViewType_old";
ALTER TYPE "ViewType_new" RENAME TO "ViewType";
DROP TYPE "public"."ViewType_old";
COMMIT;
