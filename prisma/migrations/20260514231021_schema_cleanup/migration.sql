-- This migration does not support transactions

/*
  Warnings:

  - The values [VIEW_CATALOG,ADD_TO_CART,MANAGE_OWN_ADDRESSES,MANAGE_OWN_ORDERS] on the enum `PermissionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [CUSTOMER] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `for_role` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `address_id` on the `order_delivery_addresses` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_coupons` table. All the data in the column will be lost.
  - You are about to drop the `favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password_reset_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_addresses` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug,for_audience]` on the table `menus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `for_audience` to the `menus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `user_coupons` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Remove CUSTOMER permissions before altering PermissionType enum
DELETE FROM "role_permissions"
WHERE "permission_id" IN (
  SELECT id FROM "permissions"
  WHERE "name" IN ('VIEW_CATALOG', 'ADD_TO_CART', 'MANAGE_OWN_ADDRESSES', 'MANAGE_OWN_ORDERS')
);
DELETE FROM "permissions"
WHERE "name" IN ('VIEW_CATALOG', 'ADD_TO_CART', 'MANAGE_OWN_ADDRESSES', 'MANAGE_OWN_ORDERS');

-- Step 2: Remove CUSTOMER role before altering RoleType enum
DELETE FROM "role_permissions"
WHERE "role_id" IN (SELECT id FROM "roles" WHERE "name" = 'CUSTOMER');
DELETE FROM "roles" WHERE "name" = 'CUSTOMER';

-- CreateEnum
CREATE TYPE "MenuAudienceType" AS ENUM ('CUSTOMER', 'ESTABLISHMENT_OWNER', 'ADMIN');

-- AlterEnum PermissionType
CREATE TYPE "PermissionType_new" AS ENUM ('MANAGE_PRODUCTS', 'MANAGE_CATEGORIES', 'MANAGE_PRODUCT_OPTIONS', 'MANAGE_DISTRICTS', 'CANCEL_ORDERS', 'MANAGE_OWN_ESTABLISHMENT', 'MANAGE_BANNERS', 'MANAGE_COUPONS', 'VIEW_CUSTOMERS', 'MANAGE_ESTABLISHMENTS', 'MANAGE_USERS', 'VIEW_DASHBOARD');
ALTER TABLE "permissions" ALTER COLUMN "name" TYPE "PermissionType_new" USING ("name"::text::"PermissionType_new");
ALTER TYPE "PermissionType" RENAME TO "PermissionType_old";
ALTER TYPE "PermissionType_new" RENAME TO "PermissionType";
DROP TYPE "public"."PermissionType_old";

-- AlterEnum RoleType: create new type and migrate roles table
CREATE TYPE "RoleType_new" AS ENUM ('ESTABLISHMENT_OWNER', 'ADMIN');
ALTER TABLE "roles" ALTER COLUMN "name" TYPE "RoleType_new" USING ("name"::text::"RoleType_new");
ALTER TYPE "RoleType" RENAME TO "RoleType_old";
ALTER TYPE "RoleType_new" RENAME TO "RoleType";

-- Migrate menus BEFORE dropping RoleType_old (menus.for_role depends on it)
ALTER TABLE "menus" ADD COLUMN "for_audience" "MenuAudienceType";
UPDATE "menus" SET "for_audience" = "for_role"::text::"MenuAudienceType";
ALTER TABLE "menus" ALTER COLUMN "for_audience" SET NOT NULL;
-- Drop unique constraint on for_role before dropping the column (cascade would remove it anyway)
ALTER TABLE "menus" DROP CONSTRAINT IF EXISTS "menus_slug_for_role_key";
ALTER TABLE "menus" DROP COLUMN "for_role";

-- Now safe to drop RoleType_old
DROP TYPE "public"."RoleType_old";

-- DropForeignKey
ALTER TABLE "delivery_addresses" DROP CONSTRAINT "delivery_addresses_user_address_id_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_product_id_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_coupons" DROP CONSTRAINT "user_coupons_user_id_fkey";

-- DropIndex
DROP INDEX "delivery_addresses_user_address_id_establishment_id_distric_key";

-- DropIndex
DROP INDEX "idx_delivery_addresses_user_address_id";

-- DropIndex
DROP INDEX "idx_order_delivery_addresses_address_id";

-- DropIndex
DROP INDEX "idx_orders_user_id";

-- DropIndex
DROP INDEX "idx_user_coupons_user_id";

-- AlterTable
ALTER TABLE "order_delivery_addresses" DROP COLUMN "address_id",
ADD COLUMN     "complement" VARCHAR(500),
ADD COLUMN     "neighborhood" VARCHAR(255),
ADD COLUMN     "reference_point" VARCHAR(500);

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "user_id";

-- AlterTable user_coupons: drop old, add new with temp default then remove it
ALTER TABLE "user_coupons" DROP COLUMN "user_id";
ALTER TABLE "user_coupons" ADD COLUMN "customer_phone" VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE "user_coupons" ALTER COLUMN "customer_phone" DROP DEFAULT;

-- DropTable
DROP TABLE "favorites";

-- DropTable
DROP TABLE "password_reset_tokens";

-- DropTable
DROP TABLE "user_addresses";

-- CreateIndex
CREATE UNIQUE INDEX "menus_slug_for_audience_key" ON "menus"("slug", "for_audience");

-- CreateIndex
CREATE INDEX "idx_user_coupons_customer_phone" ON "user_coupons"("customer_phone");
