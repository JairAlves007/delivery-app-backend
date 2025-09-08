/*
  Warnings:

  - The values [CLIENT] on the enum `RoleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."RoleType_new" AS ENUM ('CUSTOMER', 'ESTABLISHMENT_OWNER', 'ADMIN');
ALTER TABLE "public"."roles" ALTER COLUMN "name" TYPE "public"."RoleType_new" USING ("name"::text::"public"."RoleType_new");
ALTER TYPE "public"."RoleType" RENAME TO "RoleType_old";
ALTER TYPE "public"."RoleType_new" RENAME TO "RoleType";
DROP TYPE "public"."RoleType_old";
COMMIT;
