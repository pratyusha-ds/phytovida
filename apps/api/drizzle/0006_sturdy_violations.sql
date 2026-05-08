ALTER TABLE "source_sync" ADD COLUMN "last_fetched_id" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "source_sync" DROP COLUMN "last_fetched_page";--> statement-breakpoint
ALTER TABLE "source_sync" DROP COLUMN "total_pages";