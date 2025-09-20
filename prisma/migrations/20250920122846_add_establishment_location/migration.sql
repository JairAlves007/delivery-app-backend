/*
  Warnings:

  - You are about to drop the column `address` on the `establishments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."establishments" DROP COLUMN "address";

-- CreateTable
CREATE TABLE "public"."establishment_locations" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT,
    "neighborhood" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "establishment_locations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_locations_establishment_id_key" ON "public"."establishment_locations"("establishment_id");

-- AddForeignKey
ALTER TABLE "public"."establishment_locations" ADD CONSTRAINT "establishment_locations_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
