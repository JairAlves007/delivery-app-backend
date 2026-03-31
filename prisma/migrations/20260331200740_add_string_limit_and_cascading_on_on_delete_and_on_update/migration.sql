/*
  Warnings:

  - You are about to alter the column `name` on the `addon_categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `addons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `reference_point` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `street` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `number` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `neighborhood` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `city` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `state` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `complement` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `phone` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `postal_code` on the `addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `name` on the `banners` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `reason` on the `closures` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `code` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `districts` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `establishments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `establishments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `establishments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.
  - You are about to alter the column `email` on the `establishments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - You are about to alter the column `cnpj` on the `establishments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(18)`.
  - You are about to alter the column `label` on the `menus` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `menus` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `opens_at` on the `opening_hours` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - You are about to alter the column `closes_at` on the `opening_hours` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(5)`.
  - You are about to alter the column `code` on the `order_coupons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `street` on the `order_delivery_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `number` on the `order_delivery_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `city` on the `order_delivery_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `state` on the `order_delivery_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `district_name` on the `order_delivery_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `postal_code` on the `order_delivery_addresses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `addon_name` on the `order_item_addons` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `product_name` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `label` on the `order_statuses` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `comment` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `customer_name` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `customer_phone` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `token_hash` on the `password_reset_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `product_categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `product_categories` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `description` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2000)`.
  - You are about to alter the column `slug` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `file_key` on the `resources` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `path` on the `resources` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `url` on the `social_links` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to alter the column `label` on the `submenus` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `slug` on the `submenus` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `label` on the `tags` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- DropForeignKey
ALTER TABLE "addon_categories" DROP CONSTRAINT "addon_categories_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "addons" DROP CONSTRAINT "addons_category_id_fkey";

-- DropForeignKey
ALTER TABLE "banner_resources" DROP CONSTRAINT "banner_resources_banner_id_fkey";

-- DropForeignKey
ALTER TABLE "banner_resources" DROP CONSTRAINT "banner_resources_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "banners" DROP CONSTRAINT "banners_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "closures" DROP CONSTRAINT "closures_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_addresses" DROP CONSTRAINT "delivery_addresses_district_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_addresses" DROP CONSTRAINT "delivery_addresses_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_addresses" DROP CONSTRAINT "delivery_addresses_user_address_id_fkey";

-- DropForeignKey
ALTER TABLE "districts" DROP CONSTRAINT "districts_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "establishment_addresses" DROP CONSTRAINT "establishment_addresses_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "establishment_resources" DROP CONSTRAINT "establishment_resources_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "establishment_resources" DROP CONSTRAINT "establishment_resources_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_product_id_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "file_formats" DROP CONSTRAINT "file_formats_resource_rule_id_fkey";

-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "opening_hours" DROP CONSTRAINT "opening_hours_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "order_coupons" DROP CONSTRAINT "order_coupons_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_delivery_addresses" DROP CONSTRAINT "order_delivery_addresses_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_item_addons" DROP CONSTRAINT "order_item_addons_order_item_id_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_order_id_fkey";

-- DropForeignKey
ALTER TABLE "order_statuses" DROP CONSTRAINT "order_statuses_order_id_fkey";

-- DropForeignKey
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT "password_reset_tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "product_categories" DROP CONSTRAINT "product_categories_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "product_category_resources" DROP CONSTRAINT "product_category_resources_category_id_fkey";

-- DropForeignKey
ALTER TABLE "product_category_resources" DROP CONSTRAINT "product_category_resources_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "product_resources" DROP CONSTRAINT "product_resources_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_resources" DROP CONSTRAINT "product_resources_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "product_tags" DROP CONSTRAINT "product_tags_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_tags" DROP CONSTRAINT "product_tags_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_role_id_fkey";

-- DropForeignKey
ALTER TABLE "social_links" DROP CONSTRAINT "social_links_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "submenus" DROP CONSTRAINT "submenus_menu_id_fkey";

-- DropForeignKey
ALTER TABLE "tag_combinations" DROP CONSTRAINT "tag_combinations_from_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "tag_combinations" DROP CONSTRAINT "tag_combinations_to_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_address_id_fkey";

-- DropForeignKey
ALTER TABLE "user_addresses" DROP CONSTRAINT "user_addresses_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_coupons" DROP CONSTRAINT "user_coupons_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "user_coupons" DROP CONSTRAINT "user_coupons_user_id_fkey";

-- AlterTable
ALTER TABLE "addon_categories" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "addons" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "reference_point" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "street" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "number" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "neighborhood" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "state" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "complement" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "banners" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "closures" ALTER COLUMN "reason" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "code" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "districts" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "establishments" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320),
ALTER COLUMN "cnpj" SET DATA TYPE VARCHAR(18);

-- AlterTable
ALTER TABLE "menus" ALTER COLUMN "label" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "opening_hours" ALTER COLUMN "opens_at" SET DATA TYPE VARCHAR(5),
ALTER COLUMN "closes_at" SET DATA TYPE VARCHAR(5);

-- AlterTable
ALTER TABLE "order_coupons" ALTER COLUMN "code" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "order_delivery_addresses" ALTER COLUMN "street" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "number" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "city" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "state" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "district_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "postal_code" SET DATA TYPE VARCHAR(10);

-- AlterTable
ALTER TABLE "order_item_addons" ALTER COLUMN "addon_name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "product_name" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "order_statuses" ALTER COLUMN "label" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "comment" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "customer_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "customer_phone" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "password_reset_tokens" ALTER COLUMN "token_hash" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "product_categories" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(2000),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "resources" ALTER COLUMN "file_key" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "path" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "social_links" ALTER COLUMN "url" SET DATA TYPE VARCHAR(2048);

-- AlterTable
ALTER TABLE "submenus" ALTER COLUMN "label" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "label" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "idx_addon_categories_establishment_id" ON "addon_categories"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_addons_category_id" ON "addons"("category_id");

-- CreateIndex
CREATE INDEX "idx_banners_establishment_id" ON "banners"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_closures_establishment_id" ON "closures"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_districts_establishment_id" ON "districts"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_menus_establishment_id" ON "menus"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_opening_hours_establishment_id" ON "opening_hours"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_order_items_order_id" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "idx_order_items_product_id" ON "order_items"("product_id");

-- CreateIndex
CREATE INDEX "idx_orders_user_id" ON "orders"("user_id");

-- CreateIndex
CREATE INDEX "idx_orders_establishment_id" ON "orders"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_orders_coupon_id" ON "orders"("coupon_id");

-- CreateIndex
CREATE INDEX "idx_orders_created_at" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "idx_password_reset_tokens_active" ON "password_reset_tokens"("expires_at", "used_at");

-- CreateIndex
CREATE INDEX "idx_product_categories_establishment_id" ON "product_categories"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_product_tags_tag_id" ON "product_tags"("tag_id");

-- CreateIndex
CREATE INDEX "idx_products_establishment_id" ON "products"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_products_category_id" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "idx_social_links_establishment_id" ON "social_links"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_submenus_menu_id" ON "submenus"("menu_id");

-- CreateIndex
CREATE INDEX "idx_tags_establishment_id" ON "tags"("establishment_id");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submenus" ADD CONSTRAINT "submenus_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closures" ADD CONSTRAINT "closures_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_combinations" ADD CONSTRAINT "tag_combinations_from_tag_id_fkey" FOREIGN KEY ("from_tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_combinations" ADD CONSTRAINT "tag_combinations_to_tag_id_fkey" FOREIGN KEY ("to_tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addon_categories" ADD CONSTRAINT "addon_categories_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addons" ADD CONSTRAINT "addons_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "addon_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_addresses" ADD CONSTRAINT "establishment_addresses_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_addresses" ADD CONSTRAINT "delivery_addresses_user_address_id_fkey" FOREIGN KEY ("user_address_id") REFERENCES "user_addresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_addresses" ADD CONSTRAINT "delivery_addresses_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_addresses" ADD CONSTRAINT "delivery_addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons" ADD CONSTRAINT "user_coupons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_coupons" ADD CONSTRAINT "user_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_coupons" ADD CONSTRAINT "order_coupons_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_addons" ADD CONSTRAINT "order_item_addons_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_statuses" ADD CONSTRAINT "order_statuses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_delivery_addresses" ADD CONSTRAINT "order_delivery_addresses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_formats" ADD CONSTRAINT "file_formats_resource_rule_id_fkey" FOREIGN KEY ("resource_rule_id") REFERENCES "resource_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_resources" ADD CONSTRAINT "banner_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_resources" ADD CONSTRAINT "banner_resources_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_resources" ADD CONSTRAINT "product_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_resources" ADD CONSTRAINT "product_resources_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_resources" ADD CONSTRAINT "establishment_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_resources" ADD CONSTRAINT "establishment_resources_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category_resources" ADD CONSTRAINT "product_category_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_category_resources" ADD CONSTRAINT "product_category_resources_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
