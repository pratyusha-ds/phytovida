export const userPlantsKeys = {
	all: ["userPlantsKeys"] as const,

	lists: () => [...userPlantsKeys.all, "list"] as const,
	list: (page: number) => [...userPlantsKeys.lists(), page] as const,

	details: () => [...userPlantsKeys.all, "detail"] as const,
	detail: (id: string) => [...userPlantsKeys.details(), id] as const,
};
