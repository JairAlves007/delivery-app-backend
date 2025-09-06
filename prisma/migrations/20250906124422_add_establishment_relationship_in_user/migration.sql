/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `establishments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."establishments" ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "establishments_user_id_key" ON "public"."establishments"("user_id");

-- AddForeignKey
ALTER TABLE "public"."establishments" ADD CONSTRAINT "establishments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
