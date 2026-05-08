export const userPlantLogsKeys = {
	all: ["user-plant-logs"] as const,

	lists: () => [...userPlantLogsKeys.all, "list"] as const,
	list: (page: number) => [...userPlantLogsKeys.lists(), page] as const,

	details: () => [...userPlantLogsKeys.all, "detail"] as const,
	detail: (id: number) => [...userPlantLogsKeys.details(), id] as const,
};
