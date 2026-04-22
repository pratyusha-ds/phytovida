import type { ReadUserPlantResponse } from "./user.plant.types";

export const readUserPlants = async (
	authFetch: any,
	page: number,
	limit?: 10,
) => {
	return authFetch(`/my-plants?page=${page}&limit=${limit}`);
};

export const readUserPlant = async (
	authFetch: any,
	id: string,
): Promise<ReadUserPlantResponse> => {
	return authFetch(`/my-plants/${id}`);
};
