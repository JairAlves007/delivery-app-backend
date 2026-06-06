/*
  Warnings:

  - You are about to drop the column `accent` on the `establishment_themes` table. All the data in the column will be lost.
  - You are about to drop the column `accent_dark` on the `establishment_themes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "establishment_themes" DROP COLUMN "accent",
DROP COLUMN "accent_dark";
