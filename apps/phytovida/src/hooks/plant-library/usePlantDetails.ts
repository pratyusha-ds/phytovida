import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/lib/authFetch";
import type { DbPlant } from "@repo/types";

export function usePlantDetails(id: string | undefined) {
  const { apiClient } = useApiClient();

  return useQuery({
    queryKey: ["plants", "detail", id],
    queryFn: async (): Promise<{ data: DbPlant; cached: boolean }> => {
      return apiClient.get(`/plants/${id}`);
    },
    enabled: !!id,
  });
}
