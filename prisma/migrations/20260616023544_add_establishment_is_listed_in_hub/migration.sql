-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "is_listed_in_hub" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "idx_establishments_hub_visibility" ON "establishments"("is_listed_in_hub", "deleted_at", "next_billing_date");
