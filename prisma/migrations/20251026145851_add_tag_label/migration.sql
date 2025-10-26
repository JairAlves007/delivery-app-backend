/*
  Warnings:

  - You are about to drop the column `name` on the `Tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type,establishment_id]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `label` to the `Tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Tag_name_establishment_id_key";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "name",
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "type" "TagType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_type_establishment_id_key" ON "Tag"("type", "establishment_id");
