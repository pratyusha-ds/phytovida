import { Link } from "react-router";
import { Button } from "@repo/ui/components/button";
import type { DashboardResponse } from "@repo/types";

type Plant = NonNullable<DashboardResponse["plants"]>[number];

export function TaskList({ plants }: { plants?: Plant[] }) {
    return (
        <>
            <div className="flex flex-col gap-4 w-full mt-6 px-4">
                <div className="flex flex-col items-stretch gap-4">
                    {plants && plants.length > 0 ? (
                        plants.slice(0, 6).map((plant, index) => (
                            <Link
                                key={plant.id}
                                to={`/my-garden/${plant.id}`}
                                className="flex items-center gap-4 p-4 bg-divider rounded-xl hover:bg-divider/80 transition-colors duration-200"
                            >
                                {plant.image ? (
                                    <img
                                        src={plant.image}
                                        alt={plant.name}
                                        className="w-20 h-20 object-cover rounded-lg shrink-0"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-lg bg-accent2/20 shrink-0" />
                                )}
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <h2 className="leading-none shrink-0">{index + 1}</h2>
                                    <p className="truncate">Track {plant.name}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="flex-1 p-6 bg-divider rounded-xl opacity-50">
                            <p>No plants added yet. Go to Growing to start!</p>
                        </div>
                    )}
                </div>
                <Button
                    className="rounded-full bg-accent2"
                    variant="secondary"
                    asChild
                >
                    <Link to="/my-garden">View all</Link>
                </Button>

            </div >
        </>

    );

}