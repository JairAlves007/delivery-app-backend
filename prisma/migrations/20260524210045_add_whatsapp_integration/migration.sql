-- CreateEnum
CREATE TYPE "WhatsAppIntegrationStatus" AS ENUM ('PENDING', 'CONNECTED', 'DISCONNECTED', 'FAILED');

-- CreateEnum
CREATE TYPE "OrderMessageTrigger" AS ENUM ('ORDER_CONFIRMED', 'STATUS_SHIPPED', 'STATUS_DELIVERED', 'STATUS_CANCELLED');

-- CreateEnum
CREATE TYPE "WhatsAppMessageStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateTable
CREATE TABLE "establishment_whatsapp_integrations" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "evolution_instance_id" TEXT NOT NULL,
    "meta_phone_number_id" VARCHAR(64) NOT NULL,
    "meta_waba_id" VARCHAR(64) NOT NULL,
    "meta_access_token" TEXT NOT NULL,
    "status" "WhatsAppIntegrationStatus" NOT NULL DEFAULT 'PENDING',
    "last_connected_at" TIMESTAMPTZ,
    "last_error" VARCHAR(1000),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "establishment_whatsapp_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_message_templates" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "trigger" "OrderMessageTrigger" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "template_text" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "order_status_message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_message_logs" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "order_id" TEXT,
    "trigger" "OrderMessageTrigger" NOT NULL,
    "to_phone" VARCHAR(20) NOT NULL,
    "status" "WhatsAppMessageStatus" NOT NULL DEFAULT 'PENDING',
    "provider_message_id" VARCHAR(255),
    "error_text" VARCHAR(1000),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "sent_at" TIMESTAMPTZ,
    "delivered_at" TIMESTAMPTZ,
    "read_at" TIMESTAMPTZ,
    "failed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_message_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_whatsapp_integrations_establishment_id_key" ON "establishment_whatsapp_integrations"("establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_whatsapp_integrations_evolution_instance_id_key" ON "establishment_whatsapp_integrations"("evolution_instance_id");

-- CreateIndex
CREATE INDEX "idx_establishment_whatsapp_integrations_establishment_id" ON "establishment_whatsapp_integrations"("establishment_id");

-- CreateIndex
CREATE INDEX "idx_establishment_whatsapp_integrations_status" ON "establishment_whatsapp_integrations"("status");

-- CreateIndex
CREATE INDEX "idx_order_status_message_templates_establishment_id" ON "order_status_message_templates"("establishment_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_status_message_templates_establishment_id_trigger_key" ON "order_status_message_templates"("establishment_id", "trigger");

-- CreateIndex
CREATE INDEX "idx_whatsapp_message_logs_establishment_status" ON "whatsapp_message_logs"("establishment_id", "status");

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
