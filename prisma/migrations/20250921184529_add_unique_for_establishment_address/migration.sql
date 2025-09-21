/*
  Warnings:

  - A unique constraint covering the columns `[establishment_id,address_id]` on the table `establishment_addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "establishment_addresses_establishment_id_address_id_key" ON "public"."establishment_addresses"("establishment_id", "address_id");
