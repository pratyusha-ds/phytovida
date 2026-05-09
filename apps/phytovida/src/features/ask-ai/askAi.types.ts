import type { DiagnosisResult } from "./services/analyzePlant.types";

export interface ResultSectionProps {
  preview: string;
  fileName?: string;
  loading: boolean;
  error: string | null;
  diagnosis: DiagnosisResult | null;
  onReset: () => void;
}
