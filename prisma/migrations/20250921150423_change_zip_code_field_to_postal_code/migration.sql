/*
  Warnings:

  - You are about to drop the column `zip_code` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `postal_code` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."addresses" DROP COLUMN "zip_code",
ADD COLUMN     "postal_code" TEXT NOT NULL;
