/*
  Warnings:

  - A unique constraint covering the columns `[platform,establishment_id]` on the table `social_links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "social_links_platform_establishment_id_key" ON "public"."social_links"("platform", "establishment_id");
