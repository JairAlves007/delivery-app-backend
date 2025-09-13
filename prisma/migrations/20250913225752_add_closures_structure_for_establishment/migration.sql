-- AlterTable
ALTER TABLE "public"."establishments" ADD COLUMN     "is_manually_closed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."closures" (
    "id" SERIAL NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "reason" TEXT,

    CONSTRAINT "closures_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."closures" ADD CONSTRAINT "closures_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
