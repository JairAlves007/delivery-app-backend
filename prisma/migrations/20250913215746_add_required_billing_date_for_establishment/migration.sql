/*
  Warnings:

  - Made the column `next_billing_date` on table `establishments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."establishments" ALTER COLUMN "next_billing_date" SET NOT NULL;
