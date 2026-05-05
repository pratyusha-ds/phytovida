export interface UserPlant {
	readonly id: number;
	plantId: string;
	phase: string;
	wateringFrequency: number;
	lastWateredDate: string;
	plantName: string;
	plantImg?: string;
	minTemp: number;
	maxTemp: number;
}
