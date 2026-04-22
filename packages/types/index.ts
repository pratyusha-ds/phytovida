// Plant Watering log type
export * from "./log";
// User plant type
export * from "./user-plant";

// Dashboard
export interface Plant {
	id: number;
	name: string;
	image: string | null;
	waterFrequency: number;
	lastWatered: string | null;
}

export interface DashboardResponse {
	location: string;
	plants: Plant[];
}

export interface Pagination {
	page: number;
	hasNextPage: boolean;
	limit: number;
	total: number;
}

export interface PaginationResponse<Data> {
	data: Data[];
	pagination: Pagination;
}
