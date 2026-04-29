import type { Pagination } from "./index";

export type ApiSuccess<T> = {
	success: true;
	message?: string;
	data: T;
};

export type ApiError = {
	success: false;
	error: true;
	message: string;
};

export type ApiPaginatedResponse<T> = {
	success: true;
	data: T[];
	pagination: Pagination;
	message?: string;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiPaginatedResponse<T> | ApiError;


export type WeatherData = {
    temperature: number;
    humidity: number;
    rainChance: number;
    description: string;
};