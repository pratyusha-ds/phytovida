import { useState } from "react";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/lib/authFetch";
import { useDebounce } from "../useDebounce";
import type { ApiPaginatedResponse, DbPlant } from "@repo/types";

const LIMIT = 10;

export function usePlantLibrary() {
    const { apiClient } = useApiClient();
    const queryClient = useQueryClient();

    const [searchInput, setSearchInput] = useState("");
    const [sourceExhausted, setSourceExhausted] = useState(false);
    const debouncedSearch = useDebounce(searchInput.trim(), 500);
    const isSearching = debouncedSearch.length > 0;

    const dbList = useInfiniteQuery({
        queryKey: ["plants", "db"],
        queryFn: async ({ pageParam }): Promise<ApiPaginatedResponse<DbPlant>> => {
            return apiClient.get(`/plants?page=${pageParam}&limit=${LIMIT}`);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.pagination.hasNextPage ? allPages.length + 1 : undefined,
        enabled: !isSearching,
    });

    const search = useQuery({
        queryKey: ["plants", "search", debouncedSearch],
        queryFn: async (): Promise<ApiPaginatedResponse<DbPlant>> => {
            return apiClient.get(`/plants/search?name=${encodeURIComponent(debouncedSearch)}`);
        },
        enabled: isSearching,
    });

    const seedMutation = useMutation({
        mutationFn: async (): Promise<{ exhausted?: boolean }> => {
            return apiClient.post("/plants/seed");
        },
        onSuccess: (result) => {
            if (result.exhausted) {
                setSourceExhausted(true);
                return;
            }
            queryClient.invalidateQueries({ queryKey: ["plants", "db"] });
        },
    });

    const plants: DbPlant[] = isSearching
        ? (search.data?.data ?? [])
        : (dbList.data?.pages.flatMap((p) => p.data) ?? []);

    const loading = isSearching ? search.isLoading : dbList.isLoading;
    const error = (isSearching ? search.error : dbList.error) as Error | null;

    const discoverMore = () => {
        if (dbList.hasNextPage) {
            dbList.fetchNextPage();
            return;
        }
        seedMutation.mutate();
    };

    return {
        plants,
        loading,
        error,
        searchInput,
        setSearchInput,
        debouncedSearch,
        isSearching,
        discoverMore,
        isDiscovering: dbList.isFetchingNextPage || seedMutation.isPending,
        sourceExhausted,
    };
}