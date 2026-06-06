-- CreateEnum
CREATE TYPE "WhatsappConnectionStatus" AS ENUM ('DISCONNECTED', 'CONNECTING', 'CONNECTED');

-- CreateEnum
CREATE TYPE "WhatsappMessageDirection" AS ENUM ('OUTBOUND', 'INBOUND');

-- CreateEnum
CREATE TYPE "WhatsappMessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'RECEIVED');

-- AlterEnum
ALTER TYPE "PermissionType" ADD VALUE 'MANAGE_WHATSAPP';

-- CreateTable
CREATE TABLE "establishment_whatsapp_integrations" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "instance_name" VARCHAR(255) NOT NULL,
    "instance_token" VARCHAR(255),
    "status" "WhatsappConnectionStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "connected_number" VARCHAR(20),
    "last_connected_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "establishment_whatsapp_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_message_templates" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "status" "OrderStatusType" NOT NULL,
    "body" VARCHAR(4000) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "order_status_message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_message_logs" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "order_id" TEXT,
    "direction" "WhatsappMessageDirection" NOT NULL,
    "status" "WhatsappMessageStatus" NOT NULL,
    "recipient" VARCHAR(32) NOT NULL,
    "order_status" "OrderStatusType",
    "payload" JSONB NOT NULL,
    "error" VARCHAR(2000),
    "provider_message_id" VARCHAR(255),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "whatsapp_message_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_whatsapp_integrations_establishment_id_key" ON "establishment_whatsapp_integrations"("establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_whatsapp_integrations_instance_name_key" ON "establishment_whatsapp_integrations"("instance_name");

-- CreateIndex
CREATE INDEX "idx_whatsapp_integrations_establishment_id" ON "establishment_whatsapp_integrations"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_whatsapp_integrations_deleted_at" ON "establishment_whatsapp_integrations"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_order_status_templates_establishment_id" ON "order_status_message_templates"("establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_status_message_templates_establishment_id_status_key" ON "order_status_message_templates"("establishment_id", "status");

-- CreateIndex
CREATE INDEX "idx_whatsapp_message_logs_establishment_id" ON "whatsapp_message_logs"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_whatsapp_message_logs_order_id" ON "whatsapp_message_logs"("order_id");

-- CreateIndex
CREATE INDEX "idx_whatsapp_message_logs_provider_message_id" ON "whatsapp_message_logs"("provider_message_id");

-- CreateIndex
CREATE INDEX "idx_whatsapp_message_logs_created_at" ON "whatsapp_message_logs"("created_at");

-- AddForeignKey
ALTER TABLE "establishment_whatsapp_integrations" ADD CONSTRAINT "establishment_whatsapp_integrations_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_message_templates" ADD CONSTRAINT "order_status_message_templates_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message_logs" ADD CONSTRAINT "whatsapp_message_logs_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_message_logs" ADD CONSTRAINT "whatsapp_message_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
