/*
  Warnings:

  - The primary key for the `banners` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "banner_resources" DROP CONSTRAINT "banner_resources_banner_id_fkey";

-- AlterTable
ALTER TABLE "banner_resources" ALTER COLUMN "banner_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "banners" DROP CONSTRAINT "banners_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "banners_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "banners_id_seq";

-- AddForeignKey
ALTER TABLE "banner_resources" ADD CONSTRAINT "banner_resources_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
