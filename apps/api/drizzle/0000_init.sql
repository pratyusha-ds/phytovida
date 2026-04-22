CREATE TABLE "plant_watering_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plant_id" text,
	"watered_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "plants" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image_url" text,
	"min_temp" integer,
	"max_temp" integer
);
--> statement-breakpoint
CREATE TABLE "user_settings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"home_location" text DEFAULT 'Leipzig'
);
--> statement-breakpoint
CREATE TABLE "users_plants" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"plant_id" text,
	"watering_frequency" integer DEFAULT 7,
	"last_watered_date" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "plant_watering_logs" ADD CONSTRAINT "plant_watering_logs_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_plants" ADD CONSTRAINT "users_plants_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE no action ON UPDATE no action;