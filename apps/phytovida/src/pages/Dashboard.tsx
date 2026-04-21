import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@repo/ui/components/button";
import { LocationCard } from "../components/LocationCard";
import { WeatherCard } from "../components/WeatherCard";
import { TaskList } from "../components/TaskList";
import { PlantCalendar } from "../components/PlantCalendar";
import { Link } from "react-router";
import type { DashboardResponse } from "@repo/types";

export default function Dashboard() {
  const { user } = useUser();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:3001/api/dashboard/${user.id}`)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => console.error("Error:", err));
  }, [user]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="h-full grid place-content-center gap-6">
      <h1 className="flex justify-center py-8 text-headline">
        Welcome, {user?.firstName || "Gardener"}
      </h1>

      <div className="flex justify-center gap-3">
        <Button className="rounded-full" variant="secondary" asChild>
          <Link to="/growing">Growing</Link>
        </Button>

        <Button className="rounded-full bg-accent3" variant="secondary" asChild>
          <Link to="/planning">Planning</Link>
        </Button>
      </div>

      <div className="min-h-1/2 flex flex-col md:flex-row items-stretch mt-6 px-4">
        <LocationCard location={data?.location ?? "London, UK"} />

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

      <div className="min-h-1/2 flex flex-col md:flex-row justify-center mt-6 px-4">
        <PlantCalendar />
      </div>
    </div>
  );
}
