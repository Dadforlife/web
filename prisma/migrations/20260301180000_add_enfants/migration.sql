-- CreateEnum
CREATE TYPE "ChildSex" AS ENUM ('garcon', 'fille');

-- CreateTable
CREATE TABLE "enfants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "prenom" TEXT NOT NULL,
    "sexe" "ChildSex" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enfants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enfants_user_id_idx" ON "enfants"("user_id");

-- AddForeignKey
ALTER TABLE "enfants" ADD CONSTRAINT "enfants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable (add enfants_data to accompagnement_requests)
ALTER TABLE "accompagnement_requests" ADD COLUMN "enfants_data" JSONB;
