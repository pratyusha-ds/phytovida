export interface UserPlantCreation {
    userId: string;
    plantId: string;
    phase: string;
    wateringFrequency: number | null;
    lastWateredDate: Date | null;
}

export interface UserPlantUpdate {
    phase?: string;
    wateringFrequency?: number | null;
}