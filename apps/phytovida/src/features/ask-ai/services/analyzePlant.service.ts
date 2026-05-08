import parseResponse from "../utils/parseResponse";
import { toBase64 } from "../utils/Tobase64";
import validateFile from "../utils/validateFile";
import type { DiagnosisResult, PlantIdResponse } from "./analyzePlant.types";

const API_KEY = import.meta.env.VITE_PLANT_ID_API_KEY;
const BASE_URL = "https://plant.id/api/v3/health_assessment";

export async function analyzePlant(file: File): Promise<DiagnosisResult> {
  if (!API_KEY) {
    throw new Error("Missing VITE_PLANT_ID_API_KEY in .env");
  }

  validateFile(file);

  const base64Image = await toBase64(file);

  // Plant.id v3 puts most config in query params; body holds the image(s)
  const url = new URL(BASE_URL);
  url.searchParams.set(
    "details",
    "local_name,description,url,treatment,classification,common_names,cause",
  );
  url.searchParams.set("language", "en");

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": API_KEY,
    },
    body: JSON.stringify({
      images: [base64Image],
    }),
  });

  if (res.status === 401)
    throw new Error("Invalid API key. Check VITE_PLANT_ID_API_KEY.");
  if (res.status === 402)
    throw new Error("No credits remaining on your Plant.id plan.");
  if (res.status === 429)
    throw new Error("Daily request limit reached. Try again tomorrow.");
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Plant.id API error ${res.status}: ${text || "request failed"}`,
    );
  }

  // Plant.id returns remaining quota in this response header
  const remainingFromHeader = Number(
    res.headers.get("x-limit-requests-remaining") ?? 0,
  );

  const data: PlantIdResponse = await res.json();

  return parseResponse(data, remainingFromHeader);
}
