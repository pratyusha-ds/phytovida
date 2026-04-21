import { Button } from "@repo/ui/components/button";
import { LocationCard } from "../components/LocationCard";
import { WeatherCard } from "../components/WeatherCard";
import { TaskList } from "../components/TaskList";
import { PlantCalendar } from "../components/PlantCalendar";

import { Link } from "react-router";

export default function Dashboard() {

    return (
        <div className="h-full grid place-content-center gap-6">
            <h1 className="flex justify-center py-8 text-headline">Welcome, username</h1>

            <div className="flex justify-center gap-3">

                <Button className="rounded-full" variant="secondary" asChild>
                    <Link to="/">Growing</Link>
                </Button>

                <Button className="rounded-full bg-accent3" variant="secondary" asChild>
                    <Link to="/">Planning</Link>
                </Button>

            </div>

            <div className="min-h-1/2 flex flex-col md:flex-row items-stretch mt-6 px-4">
                {/* Left box */}
                <div className="flex-1 flex flex-col items-start p-6 gap-4">
                    <LocationCard />
                </div>

                {/* Right box */}
                <div className="flex-1 flex flex-col items-start bg-accent1 rounded-xl p-8 gap-6">
                    <WeatherCard />
                </div>
            </div>
            <div className="min-h-1/2 flex flex-col md:flex-row items-stretch mt-6 px-4">
                <div className="flex-1 flex flex-col items-start p-6 gap-4">
                    <h2>Today's tasks</h2>
                    <TaskList />
                </div>

            </div>

            {/* // TODO: Add task dot indicators (reminders?) and badge component ("Planting", "Watering") */}
            <div className="min-h-1/2 flex flex-col md:flex-row justify-center mt-6 px-4">
                <PlantCalendar />
            </div>

        </div>
    );
}