-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER_CREATED');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "link" VARCHAR(512),
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_user_states" (
    "id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "seen_at" TIMESTAMPTZ,
    "dismissed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_user_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_notifications_establishment_created" ON "notifications"("establishment_id", "created_at");

-- CreateIndex
CREATE INDEX "idx_notifications_expires_at" ON "notifications"("expires_at");

-- CreateIndex
CREATE INDEX "idx_notification_user_states_user_id" ON "notification_user_states"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_user_states_notification_id_user_id_key" ON "notification_user_states"("notification_id", "user_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_user_states" ADD CONSTRAINT "notification_user_states_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_user_states" ADD CONSTRAINT "notification_user_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
