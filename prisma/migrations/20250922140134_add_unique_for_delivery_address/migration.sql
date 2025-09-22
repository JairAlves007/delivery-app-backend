/*
  Warnings:

  - A unique constraint covering the columns `[user_address_id,establishment_id,district_id]` on the table `delivery_addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "delivery_addresses_user_address_id_establishment_id_distric_key" ON "public"."delivery_addresses"("user_address_id", "establishment_id", "district_id");
