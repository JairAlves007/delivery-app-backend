/*
  Warnings:

  - Made the column `view_type` on table `submenus` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "submenus" ALTER COLUMN "view_type" SET NOT NULL;
