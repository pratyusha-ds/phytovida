import type { ApiSuccess, UserPlantWateringLog } from "@repo/types";

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

export type CreateLogInput = {
	userPlantId: number;
	wateredAt?: string;
};

export interface CreateUserPlantLogResponse {
	data: ApiSuccess<UserPlantWateringLog>;
}