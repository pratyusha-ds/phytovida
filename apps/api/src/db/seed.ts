import "dotenv/config";
import { faker } from "@faker-js/faker";

import {
	userSettings,
	plants,
	usersPlants,
	plantWateringLogs,
} from "./schema.js";
import { db } from "./index.js";

// helper: fake Clerk-style ID
function clerkId() {
	return `user_${faker.string.alphanumeric(10)}`;
}

async function main() {
	console.log("🌱 Seeding database...");

	// -----------------------------
	// 1. USERS
	// -----------------------------
	const users = Array.from({ length: 5 }).map(() => ({
		userId: clerkId(),
		homeLocation: faker.location.city(),
	}));

	await db.insert(userSettings).values(users);

	console.log("✅ Users seeded");

	// -----------------------------
	// 2. PLANTS (fixed realistic dataset)
	// -----------------------------
	const plantData = [
		{ id: "monstera", name: "Monstera Deliciosa", minTemp: 18, maxTemp: 30 },
		{ id: "snake", name: "Snake Plant", minTemp: 15, maxTemp: 32 },
		{ id: "pothos", name: "Pothos", minTemp: 16, maxTemp: 28 },
		{ id: "ficus", name: "Fiddle Leaf Fig", minTemp: 18, maxTemp: 26 },
		{ id: "spider", name: "Spider Plant", minTemp: 10, maxTemp: 30 },
	];

	await db.insert(plants).values(plantData);

	console.log("✅ Plants seeded");

	// -----------------------------
	// 3. USER PLANTS (relations)
	// -----------------------------
	const userPlantsData = users.flatMap((user) =>
		plantData.slice(0, 3).map((plant) => ({
			userId: user.userId,
			plantId: plant.id,
			wateringFrequency: faker.number.int({ min: 3, max: 10 }),
			lastWateredDate: faker.date.recent({ days: 10 }),
		})),
	);

	await db.insert(usersPlants).values(userPlantsData);

	console.log("✅ User plants seeded");

	// -----------------------------
	// 4. WATERING LOGS
	// -----------------------------
	const logs = userPlantsData.flatMap((entry) =>
		Array.from({ length: 3 }).map(() => ({
			userId: entry.userId,
			plantId: entry.plantId,
			wateredAt: faker.date.recent({ days: 30 }),
			updatedAt: new Date(),
		})),
	);

	await db.insert(plantWateringLogs).values(logs);

	console.log("✅ Watering logs seeded");

	console.log("🌿 Seeding completed successfully!");
	await db.$client.end();
}

main().catch(async (err) => {
	console.error("❌ Seed failed:", err);
	await db.$client.end();
	process.exit(1);
});
