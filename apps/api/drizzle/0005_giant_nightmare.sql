CREATE TABLE "source_sync" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"last_fetched_page" integer DEFAULT 0 NOT NULL,
	"total_pages" integer,
	"status" text DEFAULT 'idle' NOT NULL,
	"last_run_at" timestamp,
	"error_message" text,
	CONSTRAINT "source_sync_source_unique" UNIQUE("source")
);
--> statement-breakpoint
ALTER TABLE "users_plants" ALTER COLUMN "watering_frequency" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users_plants" ALTER COLUMN "last_watered_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "plants" ADD COLUMN "watering" text;--> statement-breakpoint
ALTER TABLE "plants" ADD COLUMN "sunlight" text;--> statement-breakpoint
ALTER TABLE "plants" ADD COLUMN "hardiness" text;--> statement-breakpoint
ALTER TABLE "users_plants" ADD COLUMN "phase" text DEFAULT 'planning';--> statement-breakpoint
ALTER TABLE "users_plants" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users_plants" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "plants" DROP COLUMN "min_temp";--> statement-breakpoint
ALTER TABLE "plants" DROP COLUMN "max_temp";