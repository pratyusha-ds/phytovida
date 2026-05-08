import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import type { ResultSectionProps } from "../askAi.types";
import { TreatmentModal } from "./TreatmentModal";

function getConfidenceLabel(confidence: number): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (confidence >= 70) return { label: "High confidence", variant: "default" };
  if (confidence >= 40)
    return { label: "Medium confidence", variant: "secondary" };
  return { label: "Low confidence", variant: "outline" };
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 70) return "bg-green-500";
  if (confidence >= 40) return "bg-amber-400";
  return "bg-red-400";
}

export function ResultSection({
  preview,
  fileName,
  loading,
  error,
  diagnosis,
  onReset,
}: ResultSectionProps) {
  const topDisease = diagnosis?.diseases[0];
  const otherDiseases = diagnosis?.diseases.slice(1) ?? [];
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl pb-12">
      {/* Image preview */}
      <div className="w-full rounded-3xl overflow-hidden h-64">
        <img
          src={preview}
          alt={fileName ?? "Uploaded plant"}
          className="w-full h-full object-contain "
        />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24 mt-1" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && !loading && (
        <Alert variant="destructive" className="w-full">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {diagnosis && !loading && (
        <Card className="w-full shadow-sm">
          <CardHeader className="pb-3">
            {/* Health status header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {diagnosis.isHealthy ? "Plant Status" : "Top Diagnosis"}
                </p>
                <h3 className="text-xl font-semibold text-foreground leading-tight">
                  {diagnosis.isHealthy
                    ? "Healthy plant 🌱"
                    : (topDisease?.commonNames[0] ??
                      topDisease?.name ??
                      "Unknown")}
                </h3>
                {!diagnosis.isHealthy &&
                  topDisease &&
                  topDisease.commonNames.length > 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      {topDisease.name}
                    </p>
                  )}
              </div>
              <Badge
                variant={
                  diagnosis.isHealthy
                    ? "default"
                    : getConfidenceLabel(topDisease?.confidence ?? 0).variant
                }
              >
                {diagnosis.isHealthy
                  ? `${diagnosis.healthProbability}% healthy`
                  : `${topDisease?.confidence ?? 0}%`}
              </Badge>            </div>

            {/* Confidence bar — only show when there's a disease */}
            {!diagnosis.isHealthy && topDisease && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{getConfidenceLabel(topDisease.confidence).label}</span>
                  <span>{topDisease.confidence}% match</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getConfidenceColor(topDisease.confidence)}`}
                    style={{ width: `${topDisease.confidence}%` }}
                  />
                </div>
              </div>
            )}

            {/* Low confidence warning */}
            {!diagnosis.isHealthy &&
              topDisease &&
              topDisease.confidence < 40 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 rounded-lg px-3 py-2 mt-2">
                  ⚠ Low confidence — try a clearer or closer photo for better
                  results
                </p>
              )}
          </CardHeader>

          <CardContent className="pt-4 flex flex-col gap-3">
            {/* Description + Treatment button for top disease */}
            {!diagnosis.isHealthy && topDisease && (
              <>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {topDisease.description}
                </p>
                <TreatmentModal disease={topDisease} />
              </>
            )}

            {/* Other possibilities */}
            {otherDiseases.length > 0 && (
              <>
                <Separator />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Other possibilities
                </p>
                <div className="flex flex-col gap-2">
                  {otherDiseases.map((disease) => (
                    <div
                      key={disease.name}
                      className="flex items-center justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-foreground block truncate">
                          {disease.commonNames[0] ?? disease.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-muted-foreground/40 rounded-full"
                            style={{ width: `${disease.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {disease.confidence}%
                        </span>
                        <TreatmentModal disease={disease} compact />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <Separator />

            {/* Remaining quota */}
            <p className="text-xs text-muted-foreground text-center">
              {diagnosis.remainingRequests} identifications remaining today
            </p>
          </CardContent>
        </Card>
      )}

      {/* Reset button */}
      {(diagnosis || error) && !loading && (
        <Button
          variant="ghost"
          onClick={onReset}
          className="text-muted-foreground"
        >
          Upload another photo
        </Button>
      )}
    </div>
  );
}
