/*
  Warnings:

  - You are about to drop the column `resource_type_id` on the `file_formats` table. All the data in the column will be lost.
  - You are about to drop the `resource_types` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `resource_rule_id` to the `file_formats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `resources` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('BANNER', 'LOGO', 'THUMBNAIL');

-- DropForeignKey
ALTER TABLE "public"."file_formats" DROP CONSTRAINT "file_formats_resource_type_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."resource_types" DROP CONSTRAINT "resource_types_resource_id_fkey";

-- AlterTable
ALTER TABLE "public"."file_formats" DROP COLUMN "resource_type_id",
ADD COLUMN     "resource_rule_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."resources" ADD COLUMN     "path" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."resource_types";

-- DropEnum
DROP TYPE "public"."ResourceFileType";

-- CreateTable
CREATE TABLE "public"."resource_rules" (
    "id" SERIAL NOT NULL,
    "type" "public"."ResourceType" NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "for" "public"."ForObjectResourceType" NOT NULL,

    CONSTRAINT "resource_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_resource_rules_type" ON "public"."resource_rules"("type");

-- CreateIndex
CREATE INDEX "idx_resource_rules_for" ON "public"."resource_rules"("for");

-- CreateIndex
CREATE INDEX "idx_file_formats_resource_rule_id" ON "public"."file_formats"("resource_rule_id");

-- AddForeignKey
ALTER TABLE "public"."file_formats" ADD CONSTRAINT "file_formats_resource_rule_id_fkey" FOREIGN KEY ("resource_rule_id") REFERENCES "public"."resource_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
