import type { ReadPlantLogsParams } from "./user-plant-log.types";

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

	return authFetch(url);
};
