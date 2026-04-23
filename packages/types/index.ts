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

// Perenual API
export interface PerenualPlant {
  id: number;
  common_name: string;
  default_image?: { medium_url: string };
  hardiness?: { min: string; max: string };
}

export interface PerenualResponse {
  data: PerenualPlant[];
}