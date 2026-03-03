-- AlterTable
ALTER TABLE "notification_preferences" ADD COLUMN     "email_messagerie" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inapp_messagerie" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "private_conversations" (
    "id" UUID NOT NULL,
    "father_id" UUID NOT NULL,
    "volunteer_id" UUID,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "closed_at" TIMESTAMP(3),
    "closed_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_messages" (
    "id" UUID NOT NULL,
    "conversation_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "sender_role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "private_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "private_conversations_father_id_idx" ON "private_conversations"("father_id");

-- CreateIndex
CREATE INDEX "private_conversations_volunteer_id_idx" ON "private_conversations"("volunteer_id");

-- CreateIndex
CREATE INDEX "private_conversations_status_idx" ON "private_conversations"("status");

-- CreateIndex
CREATE INDEX "private_conversations_created_at_idx" ON "private_conversations"("created_at" DESC);

-- CreateIndex
CREATE INDEX "private_messages_conversation_id_idx" ON "private_messages"("conversation_id");

-- CreateIndex
CREATE INDEX "private_messages_sender_id_idx" ON "private_messages"("sender_id");

-- CreateIndex
CREATE INDEX "private_messages_created_at_idx" ON "private_messages"("created_at");

-- CreateIndex
CREATE INDEX "private_messages_conversation_id_is_read_idx" ON "private_messages"("conversation_id", "is_read");

-- AddForeignKey
ALTER TABLE "private_conversations" ADD CONSTRAINT "private_conversations_father_id_fkey" FOREIGN KEY ("father_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_conversations" ADD CONSTRAINT "private_conversations_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_conversations" ADD CONSTRAINT "private_conversations_closed_by_id_fkey" FOREIGN KEY ("closed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_messages" ADD CONSTRAINT "private_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "private_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_messages" ADD CONSTRAINT "private_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
