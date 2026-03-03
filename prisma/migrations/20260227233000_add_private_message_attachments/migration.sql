ALTER TABLE "private_messages"
ADD COLUMN "attachment_name" TEXT,
ADD COLUMN "attachment_mime" TEXT,
ADD COLUMN "attachment_size" INTEGER,
ADD COLUMN "attachment_data" BYTEA;
