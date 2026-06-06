-- CreateEnum
CREATE TYPE "DigitalMenuSource" AS ENUM ('GENERATED', 'UPLOADED');

-- CreateEnum
CREATE TYPE "DigitalMenuStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- AlterEnum
ALTER TYPE "PermissionType" ADD VALUE 'MANAGE_DIGITAL_MENU';

-- CreateTable
CREATE TABLE "establishment_digital_menus" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "source" "DigitalMenuSource" NOT NULL,
    "status" "DigitalMenuStatus" NOT NULL DEFAULT 'PENDING',
    "file_path" VARCHAR(512),
    "file_key" VARCHAR(255),
    "generated_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "establishment_digital_menus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_digital_menus_establishment_id_key" ON "establishment_digital_menus"("establishment_id");

-- AddForeignKey
ALTER TABLE "establishment_digital_menus" ADD CONSTRAINT "establishment_digital_menus_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
