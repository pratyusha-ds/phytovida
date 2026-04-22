import { useQuery } from "@tanstack/react-query";
import { useAuthFetch } from "@/lib/authFetch";
import { readUserPlant, userPlantsKeys } from "@/api";

export const useUserPlant = (id: string) => {
	const { authFetch } = useAuthFetch();

	return useQuery({
		queryKey: userPlantsKeys.detail(id),
		queryFn: () => readUserPlant(authFetch, id),
		enabled: !!id,
	});
};
