-- AlterEnum
ALTER TYPE "ForObjectResourceType" ADD VALUE 'BANNER';

-- CreateTable
CREATE TABLE "banner_resources" (
    "id" TEXT NOT NULL,
    "resource_id" TEXT NOT NULL,
    "banner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_banner_resources_banner_id" ON "banner_resources"("banner_id");

-- CreateIndex
CREATE INDEX "idx_banner_resources_resource_id" ON "banner_resources"("resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "banner_resources_banner_id_resource_id_key" ON "banner_resources"("banner_id", "resource_id");

-- AddForeignKey
ALTER TABLE "banner_resources" ADD CONSTRAINT "banner_resources_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_resources" ADD CONSTRAINT "banner_resources_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "banners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
