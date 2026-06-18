/*
  Warnings:

  - A unique constraint covering the columns `[establishment_id,status,is_scheduled]` on the table `order_status_message_templates` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "order_status_message_templates_establishment_id_status_key";

-- AlterTable
ALTER TABLE "order_status_message_templates" ADD COLUMN     "is_scheduled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "scheduled_at" TIMESTAMPTZ;

-- CreateIndex
CREATE UNIQUE INDEX "order_status_message_templates_establishment_id_status_is_s_key" ON "order_status_message_templates"("establishment_id", "status", "is_scheduled");

-- CreateIndex
CREATE INDEX "idx_orders_scheduled_at" ON "orders"("scheduled_at");
