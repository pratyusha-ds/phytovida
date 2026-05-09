CREATE TABLE "push_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plant_id" integer NOT NULL,
	"endpoint" text NOT NULL,
	"notification_type" text NOT NULL,
	"last_sent_date" date
);
--> statement-breakpoint
CREATE UNIQUE INDEX "push_notification_unique_idx" ON "push_notifications" USING btree ("user_id","plant_id","endpoint","notification_type");