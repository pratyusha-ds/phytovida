ALTER TABLE "users_plants" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users_plants" ADD COLUMN "updated_at" timestamp;