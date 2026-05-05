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
