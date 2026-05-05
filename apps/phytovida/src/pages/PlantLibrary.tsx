import { Button } from "@repo/ui/components/button";
import { useApiClient } from "@/lib/authFetch";
import type { ApiPaginatedResponse, DbPlant } from "@repo/types";
import { useCallback, useEffect, useRef, useState } from "react";
import CreateUserPlantForm from "@/components/UserPlantCreation/CreateUserPlantForm";
import { SearchBar } from '../components/SearchBar'


export default function PlantLibrary() {
    const [loading, setLoading] = useState(false);
    const [allPlants, setAllPlants] = useState<DbPlant[]>([]);
    const { apiClient } = useApiClient();
    const [error, setError] = useState("");
    const pageRef = useRef(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [seeding, setSeeding] = useState(false);
    const [sourceExhausted, setSourceExhausted] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const observerRef = useRef<HTMLDivElement | null>(null);
    const limit = 10;

    const fetchData = useCallback(async (page: number, search = "") => {
        try {
            setLoading(true);
            setError("");

            const data: ApiPaginatedResponse<DbPlant> = await apiClient.get(
                `/plants?page=${page}&limit=${limit}&search=${search}`,
            );

            setAllPlants((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const filtered = data.data.filter((p) => !existingIds.has(p.id));
                return [...prev, ...filtered];
            });

            setHasNextPage(data.pagination.hasNextPage);
            pageRef.current += 1;

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    }, [apiClient]);


    useEffect(() => {
        fetchData(1);
    }, []);


    useEffect(() => {
        const timer = setTimeout(() => {
            setAllPlants([]);
            pageRef.current = 1;
            fetchData(1, searchInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput]);


    const handleDiscoverMore = async () => {
        if (hasNextPage) {
            await fetchData(pageRef.current);
            return;
        }

        try {
            setSeeding(true);
            const result = await apiClient.post("/plants/seed");

            if (result.exhausted) {
                setSourceExhausted(true);
                return;
            }

            pageRef.current = 1;
            await fetchData(1)
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSeeding(false)
        }
    }


    return (
        <section className="w-full space-y-10  md:mt-32 ">
            <div className="h-full grid place-content-center gap-10">
                <h1 className="flex justify-center text-headline md:text-8xl">
                    Plant Library
                </h1>
                <div className="flex justify-center gap-10 px-8">
                    <h4 className="text-accent6 text-2xl text-center max-w-xl">Browse our plant database to find out more about your favourite plants and choose what to grow next.</h4>
                </div>
                <div className="flex justify-center gap-3 px-8">
                    <SearchBar value={searchInput} onChange={setSearchInput} />
                </div>


                {error && <p className="text-red-500 text-center">{error}</p>}

                {allPlants.length > 0 && (
                    <ul className="grid grid-col-1 md:grid-cols-2 gap-4">
                        {allPlants.map((plant) => (
                            <li key={plant.id} className="border rounded p-4">
                                {plant.imageUrl && (
                                    <img src={plant.imageUrl} alt={plant.name} className="w-full rounded mb-2" />
                                )}
                                <p className="font-semibold">{plant.name}</p>
                                <CreateUserPlantForm plantId={plant.id} name={plant.name} />
                            </li>
                        ))}
                    </ul>
                )}

                {loading && <p className="text-center">Loading plants...</p>}

                <div ref={observerRef} className="h-10 w-full" />

                <div className="flex justify-center gap-3">
                    {!sourceExhausted ? (
                        <Button className="rounded-full"
                            variant="secondary"
                            onClick={handleDiscoverMore}
                            disabled={loading || seeding}>
                            {seeding ? "Please wait..." : "Discover more"}
                        </Button>
                    ) : (
                        <p> You've discovered all available plants</p>
                    )}
                </div>

            </div>
        </section>

    );

}