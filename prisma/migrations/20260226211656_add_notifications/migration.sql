-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "email_account" BOOLEAN NOT NULL DEFAULT true,
    "email_forum" BOOLEAN NOT NULL DEFAULT true,
    "email_community" BOOLEAN NOT NULL DEFAULT true,
    "email_programme" BOOLEAN NOT NULL DEFAULT true,
    "email_admin" BOOLEAN NOT NULL DEFAULT true,
    "email_engagement" BOOLEAN NOT NULL DEFAULT true,
    "inapp_account" BOOLEAN NOT NULL DEFAULT true,
    "inapp_forum" BOOLEAN NOT NULL DEFAULT true,
    "inapp_community" BOOLEAN NOT NULL DEFAULT true,
    "inapp_programme" BOOLEAN NOT NULL DEFAULT true,
    "inapp_admin" BOOLEAN NOT NULL DEFAULT true,
    "inapp_engagement" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_key" ON "notification_preferences"("user_id");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
