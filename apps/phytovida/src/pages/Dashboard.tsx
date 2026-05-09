import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { LocationCard } from "../components/LocationCard";
import { WeatherCard } from "../components/WeatherCard";
import { TaskList } from "../components/TaskList";
import { PlantCalendar } from "../components/PlantCalendar";
import type { DashboardResponse } from "@repo/types";

export default function Dashboard() {
  const { user } = useUser();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("London, UK");


  useEffect(() => {
    if (!user) return;

    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const finalUrl = `${baseUrl}/dashboard/${user.id}`;

    fetch(finalUrl)
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        if (resData.location) setLocation(resData.location);
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

      <div className="min-h-1/2 flex flex-col md:flex-row items-stretch mt-6 px-4">
        <LocationCard location={location} onLocationChange={setLocation} />

        <div className="flex-1 flex flex-col items-start bg-accent1 rounded-xl p-8 gap-6">
          <WeatherCard location={location}/>
        </div>
      </div>

      <div className="min-h-1/2 flex flex-col md:flex-row items-stretch mt-6 px-4">
        <div className="flex-1 flex flex-col items-start p-6 gap-4">
          <h2>Today's tasks</h2>
          <TaskList plants={data?.plants}/>
        </div>
      </div>

      <div className="min-h-1/2 flex flex-col md:flex-row justify-center mt-6 px-4">
        <PlantCalendar />
      </div>
    </div>
  );
}
