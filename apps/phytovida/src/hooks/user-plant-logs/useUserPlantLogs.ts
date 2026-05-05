import {
	createUserPlantLog,
	readUserPlantLogs,
	userPlantLogsKeys,
} from "@/api";
import type { CreateLogInput } from "@/api/user-plant-logs/user-plant-log.types";
import { useApiClient } from "@/lib/authFetch";
import type { ApiPaginatedResponse, UserPlantWateringLog } from "@repo/types";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

export const useUserPlantLogs = (userPlantId: number) => {
	const { apiClient } = useApiClient();
	return useInfiniteQuery({
		queryKey: userPlantLogsKeys.list(userPlantId),
		queryFn: ({ pageParam = 1 }) =>
			readUserPlantLogs(apiClient.get, {
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
		enabled: !!userPlantId && !isNaN(userPlantId),
	});
};

export const useCreateUserPlantLog = () => {
	const { apiClient } = useApiClient();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ userPlantId }: CreateLogInput) =>
			createUserPlantLog(apiClient.post, userPlantId),
		onSuccess: (newLog, { userPlantId }) => {
			queryClient.setQueryData(
				userPlantLogsKeys.list(userPlantId),
				(old: any) => {
					if (!old) return old;

					return {
						...old,
						pages: old.pages.map((page: any, i: number) =>
							i === 0
								? {
									...page,
									data: [newLog.data, ...page.data],
								}
								: page,
						),
					};
				},
			);
		},
	});
};
