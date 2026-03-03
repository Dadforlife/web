-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('accompagnement_terrain', 'telephonique');

-- CreateTable
CREATE TABLE "volunteer_appointments" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "father_id" UUID NOT NULL,
    "type" "AppointmentType" NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "status" TEXT NOT NULL DEFAULT 'a_venir',
    "location" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "volunteer_appointments_profile_id_scheduled_at_idx" ON "volunteer_appointments"("profile_id", "scheduled_at");

-- CreateIndex
CREATE INDEX "volunteer_appointments_father_id_idx" ON "volunteer_appointments"("father_id");

-- AddForeignKey
ALTER TABLE "volunteer_appointments" ADD CONSTRAINT "volunteer_appointments_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "volunteer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_appointments" ADD CONSTRAINT "volunteer_appointments_father_id_fkey" FOREIGN KEY ("father_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
