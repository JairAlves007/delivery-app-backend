-- AlterTable
ALTER TABLE "public"."banners" ALTER COLUMN "category_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."banners" ADD CONSTRAINT "banners_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."banners" ADD CONSTRAINT "banners_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
