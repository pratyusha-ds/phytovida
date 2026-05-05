import type { ReadUserPlantResponse } from "./user.plant.types";

export const readUserPlants = async (
	authFetch: any,
	page: number,
	limit: number = 10,
) => {
	return authFetch(`/plants?page=${page}&limit=${limit}`);
};

export const readUserPlant = async (
	authFetch: any,
	id: string,
): Promise<ReadUserPlantResponse> => {
  return authFetch(`/my-plants/${id}`);
};

export const createUserPlant = async (
	authFetch: any,
	data: {
		plantId: string;
		phase: string;
		wateringFrequency: number | null;
		lastWateredDate: Date | null;
	}) => {
	return await authFetch("/my-plants", data);
};

export const updateUserPlantFields = async (
	authFetch: any,
	userPlantId: number,
	data: {
		fields: { name: string, value: any }[]
	}
) => {
	const resp = await authFetch(`/my-plants/${userPlantId}`, data);
	return resp.data;
}

export const deleteUserPlant = async (
	authFetch: any,
	userPlantId: number
) => {
	console.log(`To delete: ${userPlantId}`)
	const resp = await authFetch(`/my-plants/${userPlantId}`);
	return resp.json();
}