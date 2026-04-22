import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  homeLocation: text("home_location").default("Leipzig"),
});

export const plants = pgTable("plants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  minTemp: integer("min_temp"),
  maxTemp: integer("max_temp"),
});

export const usersPlants = pgTable("users_plants", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), //Clerk ID
  plantId: text("plant_id").references(() => plants.id),
  wateringFrequency: integer("watering_frequency").default(7),
  lastWateredDate: timestamp("last_watered_date").defaultNow(),
});

export const plantWateringLogs = pgTable("plant_watering_logs", {
	id: serial("id").primaryKey(),
	userId: text("user_id").notNull(), //Clerk ID
	plantId: text("plant_id").references(() => plants.id),
	wateredAt: timestamp("watered_at").defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});
