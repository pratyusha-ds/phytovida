import { db } from "./index.js";

async function resetDb() {
	console.log("🧨 Resetting database...");

	await db.execute(` 
		DROP TABLE IF EXISTS plant_watering_logs CASCADE;
		DROP TABLE IF EXISTS users_plants CASCADE;
		DROP TABLE IF EXISTS plants CASCADE;
		DROP TABLE IF EXISTS user_settings CASCADE;
	`);

	console.log("✅ Database reset complete");
	process.exit(0);
}

resetDb();
