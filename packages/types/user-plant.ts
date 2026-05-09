export interface UserPlant {
	readonly id: number;
	plantId: string;
	phase: string;
	wateringFrequency: number;
	lastWateredDate: string;
	plantName: string;
	plantImg?: string;
	sunlight: string;
	watering: string;
	hardiness?: string;
}
