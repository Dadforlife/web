-- CreateEnum
CREATE TYPE "AccompagnementRequestStatus" AS ENUM ('pending', 'reviewing', 'contacted', 'active', 'completed', 'rejected');

-- CreateTable
CREATE TABLE "accompagnement_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "father_first_name" TEXT NOT NULL,
    "father_city" TEXT NOT NULL,
    "father_phone" TEXT NOT NULL,
    "father_email" TEXT,
    "situation_description" TEXT NOT NULL,
    "mother_phone" TEXT NOT NULL,
    "status" "AccompagnementRequestStatus" NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accompagnement_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accompagnement_requests_user_id_idx" ON "accompagnement_requests"("user_id");
CREATE INDEX "accompagnement_requests_status_idx" ON "accompagnement_requests"("status");
CREATE INDEX "accompagnement_requests_created_at_idx" ON "accompagnement_requests"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "accompagnement_requests" ADD CONSTRAINT "accompagnement_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
