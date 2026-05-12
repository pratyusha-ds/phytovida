import type { DashboardResponse } from "@repo/types";
import PlantList from "./PlantList";

type Plant = NonNullable<DashboardResponse["plants"]>[number];

export type PlantWateringDue = {
    plant: Plant,
    daysOverDue: number
}

export function TaskList({ plants }: { plants: Plant[] }) {
    // last_watered + wf > today
    const { overdue, dueToday } = plants.reduce<{ overdue: PlantWateringDue[], dueToday: PlantWateringDue[] }>((acc, p) => {
        if (p.lastWatered) {
            const daysSinceWatered = Math.floor((Date.now() - new Date(p.lastWatered).getTime()) / 86400000);
            const daysOverdue = daysSinceWatered - p.wateringFrequency;
            if (daysOverdue > 0) acc.overdue.push({ plant: p, daysOverDue: daysOverdue });
            else acc.dueToday.push({ plant: p, daysOverDue: daysOverdue });
        }
        return acc;
    }, { overdue: [], dueToday: [] });
    return (
        <>
            <div className="flex flex-col gap-4 w-full mt-6 px-4">
                {overdue.length === 0 && dueToday.length === 0 &&
                    <p className="text-sm text-gray-400 py-3 px-1">All caught up! 🌱</p>
                }
                {overdue.length > 0 &&
                    <>
                        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Overdue</p>
                        <PlantList plants={overdue} />
                    </>
                }

                {dueToday.length > 0 &&
                    <>
                        <p className="text-xs font-medium uppercase tracking-widest text-gray-400pnpm run build">Due today</p>
                        <PlantList plants={dueToday} />
                    </>
                }
            </div >
        </>

    );

}