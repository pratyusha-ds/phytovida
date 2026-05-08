import { useEffect, useState } from "react";
import { getWeather } from "../../api/weather/open-meteo";
import type { WeatherData } from "@repo/types"


export function useWeather(location: string) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        console.log("location:", location);
        if (!location) return;

        async function fetchWeather() {
            try {
                const data = await getWeather(location);
                setWeather(data)
            } catch(err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, [location]);

    return { weather, loading, error };
};