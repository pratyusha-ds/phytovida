ALTER TABLE "users_plants" ALTER COLUMN "watering_frequency" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users_plants" ALTER COLUMN "last_watered_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users_plants" ADD COLUMN "phase" text DEFAULT 'planning';