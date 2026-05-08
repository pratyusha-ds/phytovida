import type {
  DiagnosisResult,
  DiseaseMatch,
  PlantIdResponse,
} from "../services/analyzePlant.types";
import { NormalizeDescription } from "./Normalizedescription";

export function parseResponse(
  data: PlantIdResponse,
  remainingFromHeader: number,
): DiagnosisResult {
  const diseases = (data.result.disease.suggestions ?? [])
    .filter((s) => s.probability > 0.05)
    .slice(0, 5)
    .map(
      (s): DiseaseMatch => ({
        name: s.name,
        commonNames: s.details?.common_names ?? [],
        confidence: Math.round(s.probability * 100),
        description: NormalizeDescription(s.details?.description),
        treatment: {
          prevention: s.details?.treatment?.prevention ?? [],
          biological: s.details?.treatment?.biological ?? [],
          chemical: s.details?.treatment?.chemical ?? [],
        },
      }),
    );

  return {
    isHealthy: data.result.is_healthy.binary,
    healthProbability: Math.round(data.result.is_healthy.probability * 100),
    diseases,
    remainingRequests: data.remaining_requests ?? remainingFromHeader,
  };
}
export default parseResponse;
