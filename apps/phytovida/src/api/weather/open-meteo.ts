const BASE_URL = "https://api.open-meteo.com/v1";
const GEO_URL = "https://geocoding-api.open-meteo.com/v1";

const WEATHER_CODES: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog",
    51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain",
    71: "Light snow", 73: "Snow", 75: "Heavy snow",
    80: "Light showers", 81: "Showers", 82: "Heavy showers",
    95: "Thunderstorm",
};

export async function geocodeLocation(location: string): Promise<{ lat: number; lng: number }> {
    const res = await fetch(`${GEO_URL}/search?name=${encodeURIComponent(location)}&count=1`);
    const data = await res.json();

    if (!data.results?.length) {
        throw new Error(`Location not found: ${location}`);
    }

    return { lat: data.results[0].latitude, lng: data.results[0].longitude };
}

export async function getWeather(location: string) {
    const { lat, lng } = await geocodeLocation(location);

    const res = await fetch(
        `${BASE_URL}/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,relative_humidity_2m&hourly=precipitation_probability&timezone=auto`
    );
    const data = await res.json();

    const temperature = Math.round(data.current.temperature_2m);
    const humidity = data.current.relative_humidity_2m;
    const weatherCode = data.current.weather_code;
    const rainChance = data.hourly.precipitation_probability[0];
    const description = WEATHER_CODES[weatherCode] ?? "Unknown";

    return { temperature, humidity, rainChance, description };
}

