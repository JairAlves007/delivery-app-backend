/*
  Warnings:

  - You are about to drop the column `image_key` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `logo_image_key` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `image_key` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ResourceFileType" AS ENUM ('BANNER', 'LOGO', 'THUMBNAIL');

-- CreateEnum
CREATE TYPE "public"."ForObjectResourceType" AS ENUM ('ESTABLISHMENT', 'PRODUCT', 'CATEGORY');

-- CreateEnum
CREATE TYPE "public"."FileFormatType" AS ENUM ('PNG', 'JPG', 'JPEG');

-- AlterTable
ALTER TABLE "public"."banners" DROP COLUMN "image_key";

-- AlterTable
ALTER TABLE "public"."establishments" DROP COLUMN "logo_image_key";

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "image_key";

-- CreateTable
CREATE TABLE "public"."file_formats" (
    "id" SERIAL NOT NULL,
    "type" "public"."FileFormatType" NOT NULL,
    "resource_type_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_formats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resource_types" (
    "id" SERIAL NOT NULL,
    "name" "public"."ResourceFileType" NOT NULL,
    "path" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "for" "public"."ForObjectResourceType" NOT NULL,
    "resource_id" TEXT NOT NULL,

    CONSTRAINT "resource_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."resources" (
    "id" TEXT NOT NULL,
    "file_key" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_resources" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."establishment_resources" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishment_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_category_resources" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_category_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_resource_types_name" ON "public"."resource_types"("name");

-- CreateIndex
CREATE INDEX "idx_resources_establishment_id" ON "public"."resources"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_resources_file_key" ON "public"."resources"("file_key");

-- CreateIndex
CREATE UNIQUE INDEX "resources_establishment_id_file_key_key" ON "public"."resources"("establishment_id", "file_key");

-- CreateIndex
CREATE INDEX "idx_product_images_product_id" ON "public"."product_resources"("product_id");

-- CreateIndex
CREATE INDEX "idx_product_images_resource_id" ON "public"."product_resources"("resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_resources_product_id_resource_id_key" ON "public"."product_resources"("product_id", "resource_id");

-- CreateIndex
CREATE INDEX "idx_establishment_resources_establishment_id" ON "public"."establishment_resources"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_establishment_resources_resource_id" ON "public"."establishment_resources"("resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_resources_establishment_id_resource_id_key" ON "public"."establishment_resources"("establishment_id", "resource_id");

-- CreateIndex
CREATE INDEX "idx_product_category_resources_category_id" ON "public"."product_category_resources"("category_id");

-- CreateIndex
CREATE INDEX "idx_product_category_resources_resource_id" ON "public"."product_category_resources"("resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_category_resources_category_id_resource_id_key" ON "public"."product_category_resources"("category_id", "resource_id");

-- AddForeignKey
ALTER TABLE "public"."file_formats" ADD CONSTRAINT "file_formats_resource_type_id_fkey" FOREIGN KEY ("resource_type_id") REFERENCES "public"."resource_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resource_types" ADD CONSTRAINT "resource_types_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."resources" ADD CONSTRAINT "resources_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_resources" ADD CONSTRAINT "product_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_resources" ADD CONSTRAINT "product_resources_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."establishment_resources" ADD CONSTRAINT "establishment_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."establishment_resources" ADD CONSTRAINT "establishment_resources_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_category_resources" ADD CONSTRAINT "product_category_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_category_resources" ADD CONSTRAINT "product_category_resources_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
