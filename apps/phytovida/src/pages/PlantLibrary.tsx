import { Button } from "@repo/ui/components/button";
import { PlantLibraryCard } from "@/components/PlantLibraryCard";
import { SearchBar } from "../components/SearchBar";
import { usePlantLibrary } from "@/hooks/plant-library/usePlantLibrary";

export default function PlantLibrary() {
    const {
        plants,
        loading,
        error,
        searchInput,
        setSearchInput,
        debouncedSearch,
        isSearching,
        discoverMore,
        isDiscovering,
        sourceExhausted,
    } = usePlantLibrary();

    return (
        <section className="w-full space-y-10 md:mt-32">
            <div className="h-full grid max-w-5xl mx-auto w-full flex flex-col gap-10">
                <h1 className="flex justify-center text-headline md:text-8xl">
                    Plant Library
                </h1>

                <div className="flex justify-center gap-10 px-8">
                    <h4 className="text-accent6 text-2xl text-center max-w-xl">
                        Browse our plant database to find out more about your favourite plants and choose what to grow next.
                    </h4>
                </div>

                <div className="flex justify-center gap-3 px-8">
                    <SearchBar value={searchInput} onChange={setSearchInput} />
                </div>

                {error && <p className="text-red-500 text-center">{error.message}</p>}

                {plants.length > 0 && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {plants.map((plant) => (
                            <li key={plant.id}>
                                <PlantLibraryCard {...plant} />
                            </li>
                        ))}
                    </ul>
                )}

                {loading && <p className="text-center">Loading plants...</p>}

                {isSearching && !loading && plants.length === 0 && (
                    <p className="text-center">No plants found for "{debouncedSearch}"</p>
                )}

                {!isSearching && (
                    <div className="flex justify-center gap-3">
                        {!sourceExhausted ? (
                            <Button
                                className="rounded-full"
                                variant="secondary"
                                onClick={discoverMore}
                                disabled={isDiscovering}
                            >
                                {isDiscovering ? "Please wait..." : "Discover more"}
                            </Button>
                        ) : (
                            <p>You've discovered all available plants</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}