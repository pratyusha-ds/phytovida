import { readUserPlantLogs, userPlantLogsKeys } from "@/api";
import { useAuthFetch } from "@/lib/authFetch";
import type { ApiPaginatedResponse, UserPlantWateringLog } from "@repo/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useUserPlantLogs = (userPlantId: number) => {
	const { authFetch } = useAuthFetch();
	return useInfiniteQuery({
		queryKey: userPlantLogsKeys.list(userPlantId),
		queryFn: ({ pageParam = 1 }) =>
			readUserPlantLogs(authFetch, {
				userPlantId,
				pagination: { page: pageParam, limit: 10 },
			}),
		getNextPageParam: (
			lastPage: ApiPaginatedResponse<UserPlantWateringLog>,
		) => {
			if (lastPage.pagination.hasNextPage) {
				return lastPage.pagination.page + 1;
			}
			return undefined;
		},
		initialPageParam: 1,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		retry: false,
	});
};
