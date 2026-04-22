import { db } from "./index.js";

async function resetDb() {
	console.log("🧨 Resetting database...");

	await db.execute(`
		TRUNCATE TABLE
			plant_watering_logs,
			users_plants,
			plants,
			user_settings
		RESTART IDENTITY CASCADE;
	`);

	console.log("✅ Database reset complete");
	process.exit(0);
}

resetDb();
