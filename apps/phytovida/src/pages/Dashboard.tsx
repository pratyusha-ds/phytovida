import { Button } from "@repo/ui/components/button";
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
                    <h2>London, UK – Spring</h2>
                    <p>Spring in London is a wonderful time for gardening with mild temperatures (15–25°C / 59–77°F), some April showers that help establish new plantings, and long sunny days.</p>
                    <Button className="rounded-full bg-accent2" variant="secondary" asChild>
                        <Link to="/">Change location</Link>
                    </Button>
                </div>

                {/* Right box */}
                <div className="flex-1 flex flex-col items-start bg-accent1 rounded-xl p-8 gap-6">
                    <h2 className="text-white leading-none">18°C</h2>
                    <p className="text-white/80">Cloudy with 40% chance of rain</p>
                    <p className="text-white/80">Humidity 69%</p>
                </div>
            </div>
            <div className="min-h-1/2 flex flex-col md:flex-row items-stretch mt-6 px-4">
                <div className="flex-1 flex flex-col items-start p-6 gap-4">
                    <h2>Today's tasks</h2>
                </div>
            </div>


            <div className="min-h-1/2 flex flex-col md:flex-row items-stretch mt-6 px-4">
                {/* First box */}
                <div className="flex-1 flex flex-col items-start p-6 gap-4">
                    <h2 className="leading-none">1</h2>
                    <p>Water tomato plants</p>
                </div>

                {/* Second box */}
                <div className="flex-1 flex flex-col items-start p-8 gap-6">
                    <h2 className="leading-none">2</h2>
                    <p>Plant seeds</p>
                </div>


                {/* Third box */}
                <div className="flex-1 flex flex-col items-start p-8 gap-6">
                    <h2 className="leading-none">3</h2>
                    <p>Add fertilizer</p>
                </div>
            </div>


            <div className="min-h-1/2 flex flex-col md:flex-row justify-center mt-6 px-4">
                <PlantCalendar />
            </div>

        </div>
    );
}