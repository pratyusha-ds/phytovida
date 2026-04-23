export interface ReadPlantLogsParams {
	userPlantId: number;
	pagination?: {
		page: number;
		limit: number;
	};
}

export interface ReadUserPlantLogResponse {
	data: {};
}
