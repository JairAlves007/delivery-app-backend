/*
  Warnings:

  - Added the required column `active_tenant_id` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "active_tenant_id" TEXT NOT NULL,
ADD COLUMN     "primary_tenant_id" TEXT;
