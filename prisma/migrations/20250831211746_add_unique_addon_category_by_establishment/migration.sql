/*
  Warnings:

  - A unique constraint covering the columns `[name,establishment_id]` on the table `addon_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addon_categories_name_establishment_id_key" ON "public"."addon_categories"("name", "establishment_id");
