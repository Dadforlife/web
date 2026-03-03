-- CreateEnum
CREATE TYPE "VolunteerRole" AS ENUM ('accompagnateur_terrain', 'ecoute_soutien', 'expertise_metier');

-- CreateTable
CREATE TABLE "volunteer_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "volunteer_role" "VolunteerRole" NOT NULL,
    "bio" TEXT,
    "city" TEXT,
    "max_assignments" INTEGER NOT NULL DEFAULT 3,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volunteer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "papa_assignments" (
    "id" UUID NOT NULL,
    "volunteer_id" UUID NOT NULL,
    "father_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "papa_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_availabilities" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "is_recurring" BOOLEAN NOT NULL DEFAULT true,
    "specific_date" TIMESTAMP(3),
    "label" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_availabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "volunteer_alerts" (
    "id" UUID NOT NULL,
    "profile_id" UUID NOT NULL,
    "father_id" UUID,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "volunteer_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "volunteer_profiles_user_id_key" ON "volunteer_profiles"("user_id");

-- CreateIndex
CREATE INDEX "papa_assignments_volunteer_id_idx" ON "papa_assignments"("volunteer_id");

-- CreateIndex
CREATE INDEX "papa_assignments_father_id_idx" ON "papa_assignments"("father_id");

-- CreateIndex
CREATE UNIQUE INDEX "papa_assignments_volunteer_id_father_id_key" ON "papa_assignments"("volunteer_id", "father_id");

-- CreateIndex
CREATE INDEX "volunteer_availabilities_profile_id_idx" ON "volunteer_availabilities"("profile_id");

-- CreateIndex
CREATE INDEX "volunteer_alerts_profile_id_is_resolved_idx" ON "volunteer_alerts"("profile_id", "is_resolved");

-- CreateIndex
CREATE INDEX "volunteer_alerts_priority_idx" ON "volunteer_alerts"("priority");

-- AddForeignKey
ALTER TABLE "volunteer_profiles" ADD CONSTRAINT "volunteer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papa_assignments" ADD CONSTRAINT "papa_assignments_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "volunteer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "papa_assignments" ADD CONSTRAINT "papa_assignments_father_id_fkey" FOREIGN KEY ("father_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_availabilities" ADD CONSTRAINT "volunteer_availabilities_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "volunteer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_alerts" ADD CONSTRAINT "volunteer_alerts_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "volunteer_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "volunteer_alerts" ADD CONSTRAINT "volunteer_alerts_father_id_fkey" FOREIGN KEY ("father_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
