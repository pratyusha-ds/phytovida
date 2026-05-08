import type { UserPlant } from "@repo/types";

export interface ReadUserPlantResponse {
	data: UserPlant;
}

export interface CreateUserPlant {
	plantId: string;
	phase: string;
	wateringFrequency: number | null;
	lastWateredDate: Date | null;
}