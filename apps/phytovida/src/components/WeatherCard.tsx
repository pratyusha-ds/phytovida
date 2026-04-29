import { useWeather } from "@/hooks/weather/useWeather";


export function WeatherCard({location}: {location: string}) {
    const { weather, loading, error } = useWeather(location);

    if (loading) return <p className="text-white/80">Loading weather...</p>;
    if (error || !weather) return <p className="text-white/80">Weather unavailable</p>;

    return (
        <>
            <h2 className="text-white leading-none">{weather.temperature}°C</h2>
            <p className="text-white/80">{weather.description} with {weather.rainChance}% chance of rain</p>
            <p className="text-white/80">{weather.humidity}%</p>
        </>

    );

}
