/*
  Warnings:

  - Added the required column `type` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "type" "ResourceType" NOT NULL;
