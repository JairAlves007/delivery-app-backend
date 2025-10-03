/*
  Warnings:

  - A unique constraint covering the columns `[establishment_id,type,for]` on the table `resource_rules` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `establishment_id` to the `resource_rules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resource_rules" ADD COLUMN     "establishment_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "resource_rules_establishment_id_type_for_key" ON "resource_rules"("establishment_id", "type", "for");

-- AddForeignKey
ALTER TABLE "resource_rules" ADD CONSTRAINT "resource_rules_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
