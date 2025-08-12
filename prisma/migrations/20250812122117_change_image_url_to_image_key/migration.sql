/*
  Warnings:

  - You are about to drop the column `image_url` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `logo_url` on the `establishments` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `products` table. All the data in the column will be lost.
  - Added the required column `image_key` to the `banners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo_image_key` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_key` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."banners" DROP COLUMN "image_url",
ADD COLUMN     "image_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."establishments" DROP COLUMN "logo_url",
ADD COLUMN     "logo_image_key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."products" DROP COLUMN "image_url",
ADD COLUMN     "image_key" TEXT NOT NULL;
