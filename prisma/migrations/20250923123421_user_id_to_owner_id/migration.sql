/*
  Warnings:

  - You are about to drop the column `user_id` on the `establishments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `establishments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."establishments" DROP CONSTRAINT "establishments_user_id_fkey";

-- DropIndex
DROP INDEX "public"."delivery_addresses_user_address_id_establishment_id_key";

-- DropIndex
DROP INDEX "public"."establishments_user_id_key";

-- AlterTable
ALTER TABLE "public"."establishments" DROP COLUMN "user_id",
ADD COLUMN     "owner_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "establishments_owner_id_key" ON "public"."establishments"("owner_id");

-- AddForeignKey
ALTER TABLE "public"."establishments" ADD CONSTRAINT "establishments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
