/*
  Warnings:

  - A unique constraint covering the columns `[name,category_id]` on the table `addons` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addons_name_category_id_key" ON "public"."addons"("name", "category_id");
