import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createDeflate } from "node:zlib";

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
	phase: text("phase").default("planning"),
	wateringFrequency: integer("watering_frequency"),
	lastWateredDate: timestamp("last_watered_date"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const plantWateringLogs = pgTable("plant_watering_logs", {
	id: serial("id").primaryKey(),
	userId: text("user_id").notNull(), //Clerk ID
	userPlantId: integer("user_plant_id")
		.notNull()
		.references(() => usersPlants.id, { onDelete: "cascade" }),
	wateredAt: timestamp("watered_at").defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});

export const sourceSync = pgTable("source_sync", {
	id: serial("id").primaryKey(),
	source: text("source").notNull().unique(), // 'perenual' (but can reuse for different APIs)
	lastFetchedPage: integer("last_fetched_page").notNull().default(0),
	totalPages: integer("total_pages"),
	status: text("status").notNull().default("idle"),
	lastRunAt: timestamp("last_run_at"),
	errorMessage: text("error_message"),
});