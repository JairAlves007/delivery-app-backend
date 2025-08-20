/*
  Warnings:

  - A unique constraint covering the columns `[slug,establishment_id]` on the table `product_categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,establishment_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_categories_slug_establishment_id_key" ON "public"."product_categories"("slug", "establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_establishment_id_key" ON "public"."products"("slug", "establishment_id");
