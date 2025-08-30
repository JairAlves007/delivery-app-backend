/*
  Warnings:

  - A unique constraint covering the columns `[name,establishment_id]` on the table `districts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "districts_name_establishment_id_key" ON "public"."districts"("name", "establishment_id");
