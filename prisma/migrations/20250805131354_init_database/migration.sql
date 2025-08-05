-- CreateEnum
CREATE TYPE "public"."OrderStatusType" AS ENUM ('Preparing', 'Shipped', 'Delivered', 'Cancelled');

-- CreateEnum
CREATE TYPE "public"."PaymentMethodType" AS ENUM ('Card', 'PIX', 'Money');

-- CreateEnum
CREATE TYPE "public"."DeliveryType" AS ENUM ('Delivery', 'Pickup');

-- CreateEnum
CREATE TYPE "public"."BannerLinkType" AS ENUM ('NONE', 'PRODUCT', 'CATEGORY');

-- CreateEnum
CREATE TYPE "public"."CouponType" AS ENUM ('Shipping', 'Order');

-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('Percentage', 'Fixed');

-- CreateEnum
CREATE TYPE "public"."AddonType" AS ENUM ('Quantity', 'Selection');

-- CreateEnum
CREATE TYPE "public"."SocialPlatform" AS ENUM ('Facebook', 'Instagram', 'Twitter', 'WhatsApp', 'TikTok');

-- CreateEnum
CREATE TYPE "public"."WeekDay" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('CLIENT', 'ESTABLISHMENT_OWNER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."PermissionType" AS ENUM ('VIEW_CATALOG', 'ADD_TO_CART', 'MANAGE_ADDRESSES', 'VIEW_OWN_ORDERS', 'CANCEL_OWN_ORDER', 'MANAGE_PRODUCTS', 'MANAGE_CATEGORIES', 'MANAGE_PRODUCT_OPTIONS', 'MANAGE_DISTRICTS', 'MANAGE_ORDERS', 'MANAGE_OWN_STORE', 'MANAGE_BANNERS', 'MANAGE_COUPONS', 'VIEW_CUSTOMERS', 'MANAGE_STORES', 'MANAGE_USERS');

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" SERIAL NOT NULL,
    "name" "public"."RoleType" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."permissions" (
    "id" SERIAL NOT NULL,
    "name" "public"."PermissionType" NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addresses" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "district_id" INTEGER NOT NULL,
    "reference_point" TEXT,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "complement" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."establishments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cnpj" TEXT,
    "only_delivery" BOOLEAN NOT NULL,
    "accepts_credit_card" BOOLEAN NOT NULL,
    "next_billing_date" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "establishments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."opening_hours" (
    "id" SERIAL NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "day_of_week" "public"."WeekDay" NOT NULL,
    "opens_at" TEXT NOT NULL,
    "closes_at" TEXT NOT NULL,
    "is_closed" BOOLEAN NOT NULL,

    CONSTRAINT "opening_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."social_links" (
    "id" SERIAL NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "platform" "public"."SocialPlatform" NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_categories" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "discount_percentage" DOUBLE PRECISION,
    "stock" INTEGER,
    "valid_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addon_categories" (
    "id" SERIAL NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "type" "public"."AddonType" NOT NULL,
    "max_quantity" INTEGER,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "addon_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."addons" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."districts" (
    "id" SERIAL NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shipping_cost" INTEGER NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."coupons" (
    "id" SERIAL NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "public"."CouponType" NOT NULL,
    "discount_type" "public"."DiscountType" NOT NULL,
    "value" INTEGER NOT NULL,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "max_uses" INTEGER,
    "uses_per_user" INTEGER,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_coupons" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "coupon_id" INTEGER NOT NULL,

    CONSTRAINT "user_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favorites" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."banners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "linkType" "public"."BannerLinkType" NOT NULL,
    "product_id" TEXT,
    "category_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."orders" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "addressId" INTEGER,
    "couponId" INTEGER,
    "comment" TEXT,
    "change_amount" INTEGER,
    "payment_method" "public"."PaymentMethodType" NOT NULL,
    "delivery_type" "public"."DeliveryType" NOT NULL,
    "shipping_fee" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_price" INTEGER NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_item_addons" (
    "id" SERIAL NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "addonPrice" INTEGER NOT NULL DEFAULT 0,
    "addonName" TEXT NOT NULL,
    "addon_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "order_item_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_statuses" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "value" "public"."OrderStatusType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "public"."permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "establishments_slug_key" ON "public"."establishments"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_categories_slug_key" ON "public"."product_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "public"."products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "public"."coupons"("code");

-- CreateIndex
CREATE UNIQUE INDEX "order_statuses_value_key" ON "public"."order_statuses"("value");

-- AddForeignKey
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addresses" ADD CONSTRAINT "addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "public"."districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."opening_hours" ADD CONSTRAINT "opening_hours_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."social_links" ADD CONSTRAINT "social_links_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_categories" ADD CONSTRAINT "product_categories_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addon_categories" ADD CONSTRAINT "addon_categories_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."addons" ADD CONSTRAINT "addons_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."addon_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."districts" ADD CONSTRAINT "districts_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."coupons" ADD CONSTRAINT "coupons_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_coupons" ADD CONSTRAINT "user_coupons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_coupons" ADD CONSTRAINT "user_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."banners" ADD CONSTRAINT "banners_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_item_addons" ADD CONSTRAINT "order_item_addons_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_item_addons" ADD CONSTRAINT "order_item_addons_addon_id_fkey" FOREIGN KEY ("addon_id") REFERENCES "public"."addons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_statuses" ADD CONSTRAINT "order_statuses_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
