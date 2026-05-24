-- AlterEnum
ALTER TYPE "ResourceType" ADD VALUE 'FAVICON';

-- CreateTable
CREATE TABLE "establishment_themes" (
    "id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "primary" VARCHAR(7) NOT NULL,
    "secondary" VARCHAR(7) NOT NULL,
    "accent" VARCHAR(7) NOT NULL,
    "destructive" VARCHAR(7) NOT NULL,
    "background" VARCHAR(7) NOT NULL,
    "foreground" VARCHAR(7) NOT NULL,
    "muted" VARCHAR(7) NOT NULL,
    "border" VARCHAR(7) NOT NULL,
    "primary_dark" VARCHAR(7) NOT NULL,
    "secondary_dark" VARCHAR(7) NOT NULL,
    "accent_dark" VARCHAR(7) NOT NULL,
    "destructive_dark" VARCHAR(7) NOT NULL,
    "background_dark" VARCHAR(7) NOT NULL,
    "foreground_dark" VARCHAR(7) NOT NULL,
    "muted_dark" VARCHAR(7) NOT NULL,
    "border_dark" VARCHAR(7) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "establishment_themes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_themes_establishment_id_key" ON "establishment_themes"("establishment_id");

-- AddForeignKey
ALTER TABLE "establishment_themes" ADD CONSTRAINT "establishment_themes_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
