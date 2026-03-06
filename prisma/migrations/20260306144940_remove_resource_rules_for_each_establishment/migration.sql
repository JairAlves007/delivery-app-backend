/*
  Warnings:

  - You are about to drop the column `establishment_id` on the `resource_rules` table. All the data in the column will be lost.
  - You are about to drop the `ProductTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagCombination` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[type,for]` on the table `resource_rules` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ProductTag" DROP CONSTRAINT "ProductTag_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductTag" DROP CONSTRAINT "ProductTag_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "TagCombination" DROP CONSTRAINT "TagCombination_from_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "TagCombination" DROP CONSTRAINT "TagCombination_to_tag_id_fkey";

-- DropForeignKey
ALTER TABLE "resource_rules" DROP CONSTRAINT "resource_rules_establishment_id_fkey";

-- DropIndex
DROP INDEX "resource_rules_establishment_id_type_for_key";

-- AlterTable
ALTER TABLE "resource_rules" DROP COLUMN "establishment_id";

-- DropTable
DROP TABLE "ProductTag";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "TagCombination";

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "TagType" NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_combinations" (
    "id" SERIAL NOT NULL,
    "from_tag_id" INTEGER NOT NULL,
    "to_tag_id" INTEGER NOT NULL,

    CONSTRAINT "tag_combinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "product_id" TEXT NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("product_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_type_establishment_id_key" ON "tags"("type", "establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "tag_combinations_from_tag_id_to_tag_id_key" ON "tag_combinations"("from_tag_id", "to_tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "resource_rules_type_for_key" ON "resource_rules"("type", "for");

-- AddForeignKey
ALTER TABLE "tags" ADD CONSTRAINT "tags_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_combinations" ADD CONSTRAINT "tag_combinations_from_tag_id_fkey" FOREIGN KEY ("from_tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_combinations" ADD CONSTRAINT "tag_combinations_to_tag_id_fkey" FOREIGN KEY ("to_tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
