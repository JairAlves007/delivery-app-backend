/*
  Warnings:

  - You are about to drop the column `country` on the `establishment_locations` table. All the data in the column will be lost.
  - Made the column `neighborhood` on table `establishment_locations` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."addresses" ALTER COLUMN "number" DROP NOT NULL,
ALTER COLUMN "number" SET DEFAULT 'N/A';

-- AlterTable
ALTER TABLE "public"."establishment_locations" DROP COLUMN "country",
ALTER COLUMN "number" SET DEFAULT 'N/A',
ALTER COLUMN "neighborhood" SET NOT NULL;
