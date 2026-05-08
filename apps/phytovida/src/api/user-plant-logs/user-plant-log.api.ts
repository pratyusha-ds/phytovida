import type {
	CreateUserPlantLogResponse,
	ReadPlantLogsParams,
} from "./user-plant-log.types";

export const readUserPlantLogs = async (
	authFetch: any,
	{ userPlantId, pagination }: ReadPlantLogsParams,
) => {
	let url = `/my-plants/${userPlantId}/logs`;

	if (pagination) {
		const params = new URLSearchParams();

		if (pagination.page) {
			params.append("page", String(pagination.page));
		}

		if (pagination.limit) {
			params.append("limit", String(pagination.limit));
		}

		url += `?${params.toString()}`;
	}

	return await authFetch(url);
};

export const createUserPlantLog = async (
	authFetch: any,
	userPlantId: number,
): Promise<CreateUserPlantLogResponse> => {
	return await authFetch(`/my-plants/${userPlantId}/logs`, {
		body: JSON.stringify({
			userPlantId,
			wateredAt: new Date().toISOString(),
		}),
		method: "POST",
	});
};
