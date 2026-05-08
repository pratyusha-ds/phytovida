import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserPlant, deleteUserPlant, readUserPlant, updateUserPlantFields, userPlantsKeys } from "@/api";
import { useApiClient } from "@/lib/authFetch";
import type { CreateUserPlant } from "@/api/user-plants/user.plant.types";

export const useUserPlant = (id: string) => {
	const { apiClient } = useApiClient();

	return useQuery({
		queryKey: userPlantsKeys.detail(id),
		queryFn: () => readUserPlant(apiClient.get, id),
		enabled: !!id,
	});
};

type ApiError = {
	status?: number;
	message: string;
};

export const useCreateUserPlant = () => {
	const { apiClient } = useApiClient();
	return useMutation<any, ApiError, CreateUserPlant>({
		mutationFn: (plant: CreateUserPlant) => createUserPlant(apiClient.post, plant)
	})
}

export const useUpdateUserPlantFields = () => {
	const { apiClient } = useApiClient();
	const queryClient = useQueryClient();

	return useMutation<any, ApiError, any>({
		mutationFn: (
			data: { userPlantId: number, body: { fields: { name: string, value: any }[] | [] } }
		) => updateUserPlantFields(apiClient.patch, data.userPlantId, data.body),
		onSuccess: (data, variables) => {
			queryClient.setQueryData(
				userPlantsKeys.detail(String(variables.userPlantId)),
				(old: any) => {
					if (!old) return old;

					return {
						...old,
						data: {
							...old.data,
							...data,
						},
					};
				}
			);

			queryClient.setQueryData(
				userPlantsKeys.list(0),
				(old: any) => {
					if (!old) return old;

					return {
						...old,
						items: old.items.map((plant: any) =>
							plant.id === variables.userPlantId
								? { ...plant, ...data }
								: plant
						),
					};
				}
			);
		}
	})
}

export const useDeleteUserPlant = () => {
	const { apiClient } = useApiClient();
	return useMutation<any, ApiError, any>({
		mutationFn: (data: { userPlantId: number }) => deleteUserPlant(apiClient.delete, data.userPlantId)
	})
}