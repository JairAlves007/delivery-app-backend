/*
  Warnings:

  - You are about to drop the column `linkType` on the `banners` table. All the data in the column will be lost.
  - Added the required column `link_type` to the `banners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."banners" DROP COLUMN "linkType",
ADD COLUMN     "link_type" "public"."BannerLinkType" NOT NULL;
