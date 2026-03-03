-- CreateEnum
CREATE TYPE "ProfessionalRole" AS ENUM ('benevole', 'avocat', 'mediateur', 'coach', 'psychologue');

-- CreateEnum
CREATE TYPE "ProfessionalStatus" AS ENUM ('en_attente', 'en_verification', 'valide', 'refuse', 'suspendu');

-- CreateEnum
CREATE TYPE "ProfessionalLevel" AS ENUM ('reference', 'valide', 'expert');

-- CreateEnum
CREATE TYPE "ProfessionalDocumentType" AS ENUM ('charte_signee', 'convention_signee', 'assurance', 'diplome', 'piece_identite');

-- CreateEnum
CREATE TYPE "GeneratedDocumentType" AS ENUM ('charte_ethique', 'convention_partenariat');

-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('professional_status_changed', 'professional_document_verified', 'professional_interview_scored', 'generated_document_created', 'gdpr_account_deleted');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gdpr_deleted_at" TIMESTAMP(3),
ADD COLUMN     "professional_level" "ProfessionalLevel" DEFAULT 'reference',
ADD COLUMN     "professional_role" "ProfessionalRole",
ADD COLUMN     "professional_status" "ProfessionalStatus" DEFAULT 'en_attente';

-- CreateTable
CREATE TABLE "professional_verifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "diploma_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "insurance_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "official_registration_number" TEXT,
    "registration_verified" BOOLEAN NOT NULL DEFAULT false,
    "interview_completed" BOOLEAN NOT NULL DEFAULT false,
    "interview_score" INTEGER,
    "admin_notes" TEXT,
    "validated_by_admin_id" UUID,
    "validated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "professional_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_documents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "document_type" "ProfessionalDocumentType" NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" UUID,

    CONSTRAINT "professional_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_reviews" (
    "id" UUID NOT NULL,
    "professional_id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professional_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_documents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "document_type" "GeneratedDocumentType" NOT NULL,
    "file_url" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_signed" BOOLEAN NOT NULL DEFAULT false,
    "signature_provider" TEXT,
    "signed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_action_logs" (
    "id" UUID NOT NULL,
    "action_type" "AdminActionType" NOT NULL,
    "actor_id" UUID NOT NULL,
    "target_user_id" UUID,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_action_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professional_verifications_user_id_key" ON "professional_verifications"("user_id");

-- CreateIndex
CREATE INDEX "professional_verifications_validated_by_admin_id_idx" ON "professional_verifications"("validated_by_admin_id");

-- CreateIndex
CREATE INDEX "professional_verifications_interview_completed_registration_idx" ON "professional_verifications"("interview_completed", "registration_verified");

-- CreateIndex
CREATE INDEX "professional_documents_user_id_document_type_idx" ON "professional_documents"("user_id", "document_type");

-- CreateIndex
CREATE INDEX "professional_documents_verified_idx" ON "professional_documents"("verified");

-- CreateIndex
CREATE INDEX "professional_reviews_professional_id_created_at_idx" ON "professional_reviews"("professional_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "professional_reviews_member_id_idx" ON "professional_reviews"("member_id");

-- CreateIndex
CREATE INDEX "generated_documents_user_id_document_type_idx" ON "generated_documents"("user_id", "document_type");

-- CreateIndex
CREATE INDEX "generated_documents_is_signed_idx" ON "generated_documents"("is_signed");

-- CreateIndex
CREATE INDEX "admin_action_logs_action_type_created_at_idx" ON "admin_action_logs"("action_type", "created_at" DESC);

-- CreateIndex
CREATE INDEX "admin_action_logs_actor_id_idx" ON "admin_action_logs"("actor_id");

-- CreateIndex
CREATE INDEX "admin_action_logs_target_user_id_idx" ON "admin_action_logs"("target_user_id");

-- CreateIndex
CREATE INDEX "users_professional_role_professional_status_idx" ON "users"("professional_role", "professional_status");

-- CreateIndex
CREATE INDEX "users_professional_level_idx" ON "users"("professional_level");

-- AddForeignKey
ALTER TABLE "professional_verifications" ADD CONSTRAINT "professional_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_verifications" ADD CONSTRAINT "professional_verifications_validated_by_admin_id_fkey" FOREIGN KEY ("validated_by_admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_documents" ADD CONSTRAINT "professional_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_documents" ADD CONSTRAINT "professional_documents_verified_by_id_fkey" FOREIGN KEY ("verified_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_reviews" ADD CONSTRAINT "professional_reviews_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_reviews" ADD CONSTRAINT "professional_reviews_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_action_logs" ADD CONSTRAINT "admin_action_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_action_logs" ADD CONSTRAINT "admin_action_logs_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
