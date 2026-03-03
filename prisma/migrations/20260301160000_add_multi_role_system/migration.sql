-- CreateEnum
CREATE TYPE "UserPrimaryRole" AS ENUM ('papa_aide', 'maman_demande', 'papa_benevole', 'professionnel');

-- AlterTable: add primary_role and roles columns
ALTER TABLE "users" ADD COLUMN "primary_role" "UserPrimaryRole" NOT NULL DEFAULT 'papa_aide';
ALTER TABLE "users" ADD COLUMN "roles" TEXT[] DEFAULT ARRAY['member']::TEXT[];

-- Migrate existing data: map old role to roles array
UPDATE "users" SET "roles" = ARRAY["role"];

-- DropColumn: remove old role column
ALTER TABLE "users" DROP COLUMN "role";

-- CreateIndex
CREATE INDEX "users_primary_role_idx" ON "users"("primary_role");
