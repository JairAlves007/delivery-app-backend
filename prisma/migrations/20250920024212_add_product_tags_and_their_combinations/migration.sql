/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `establishments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."TagType" AS ENUM ('FOOD', 'DRINK', 'COMBO', 'DESSERT', 'SNACK', 'SIDE', 'ALCOHOLIC_DRINK', 'NON_ALCOHOLIC_DRINK', 'HOT_DRINK', 'COLD_DRINK', 'COFFEE', 'TEA', 'JUICE', 'SODA', 'MILK_SHAKE', 'SMOOTHIE', 'ICE_CREAM', 'BREAKFAST', 'LUNCH', 'DINNER', 'FRUIT', 'VEGETABLE', 'MEAT', 'FISH', 'APPETIZER', 'PASTRY', 'SALAD', 'SOUP', 'PIZZA', 'BURGER', 'SANDWICH', 'PASTA', 'GRILL', 'SUSHI', 'VEGAN', 'VEGETARIAN', 'GLUTEN_FREE', 'CAKE', 'COOKIE', 'PIE');

-- CreateTable
CREATE TABLE "public"."Tag" (
    "id" SERIAL NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "name" "public"."TagType" NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TagCombination" (
    "id" SERIAL NOT NULL,
    "from_tag_id" INTEGER NOT NULL,
    "to_tag_id" INTEGER NOT NULL,

    CONSTRAINT "TagCombination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductTag" (
    "product_id" TEXT NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("product_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_establishment_id_key" ON "public"."Tag"("name", "establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "TagCombination_from_tag_id_to_tag_id_key" ON "public"."TagCombination"("from_tag_id", "to_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "establishments_email_key" ON "public"."establishments"("email");

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TagCombination" ADD CONSTRAINT "TagCombination_from_tag_id_fkey" FOREIGN KEY ("from_tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TagCombination" ADD CONSTRAINT "TagCombination_to_tag_id_fkey" FOREIGN KEY ("to_tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductTag" ADD CONSTRAINT "ProductTag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductTag" ADD CONSTRAINT "ProductTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
