export interface PlantWateringLog {
	readonly id: number;
	userId: string;
	plantId: string;
	wateredAt: string;
	updatedAt: string;
}

export interface PlantLogData {
	readonly id: number;
	plantId: string;
	wateredAt: string;
	plantName: string;
	plantImage?: string;
}
