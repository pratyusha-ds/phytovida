ALTER TABLE "plant_watering_logs" RENAME COLUMN "plant_id" TO "user_plant_id";--> statement-breakpoint
ALTER TABLE "plant_watering_logs" DROP CONSTRAINT "plant_watering_logs_plant_id_plants_id_fk";
--> statement-breakpoint
ALTER TABLE "plant_watering_logs" ADD CONSTRAINT "plant_watering_logs_user_plant_id_users_plants_id_fk" FOREIGN KEY ("user_plant_id") REFERENCES "public"."users_plants"("id") ON DELETE cascade ON UPDATE no action;