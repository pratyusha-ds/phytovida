import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import type { DiseaseMatch } from "../services/analyzePlant.types";



interface TreatmentModalProps {
  disease: DiseaseMatch;
  compact?: boolean;
}

export function TreatmentModal({ disease, compact = false }: TreatmentModalProps) {
  const [open, setOpen] = useState(false);

  const hasTreatment =
    disease.treatment.prevention.length > 0 ||
    disease.treatment.biological.length > 0 ||
    disease.treatment.chemical.length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {compact ? (
          <button
            className="text-xs font-medium text-green-700 dark:text-green-400 hover:underline shrink-0"
            aria-label={`View treatment for ${disease.name}`}
          >
            View →
          </button>
        ) : (
          <Button variant="default" size="sm" className="w-full">
            View Treatment Suggestions →
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <DialogTitle className="text-base leading-tight">
                {disease.commonNames[0] ?? disease.name}
              </DialogTitle>
              {disease.commonNames[0] && (
                <p className="text-sm text-muted-foreground italic mt-0.5 truncate">
                  {disease.name}
                </p>
              )}
            </div>
            <Badge
              variant={disease.confidence >= 70 ? "destructive" : "secondary"}
              className="shrink-0 mt-0.5"
            >
              {disease.confidence}% match
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          {/* Description */}
          {disease.description && (
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {disease.description}
            </p>
          )}

          {/* Treatment tabs */}
          {hasTreatment ? (
            <Tabs defaultValue="prevention">
              <TabsList className="w-full">
                <TabsTrigger value="prevention" className="flex-1 text-xs">
                  🛡️ Prevention
                </TabsTrigger>
                <TabsTrigger value="biological" className="flex-1 text-xs">
                  🌿 Biological
                </TabsTrigger>
                <TabsTrigger value="chemical" className="flex-1 text-xs">
                  ⚗️ Chemical
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prevention" className="mt-3">
                <TreatmentList
                  items={disease.treatment.prevention}
                  emptyText="No prevention tips available."
                />
              </TabsContent>

              <TabsContent value="biological" className="mt-3">
                <TreatmentList
                  items={disease.treatment.biological}
                  emptyText="No biological treatments available."
                />
              </TabsContent>

              <TabsContent value="chemical" className="mt-3">
                <div className="mb-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
                  ⚠️ Always follow label instructions and local regulations when
                  applying chemical treatments.
                </div>
                <TreatmentList
                  items={disease.treatment.chemical}
                  emptyText="No chemical treatments available."
                />
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No treatment data available for this disease.
            </p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function TreatmentList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-3">
        {emptyText}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed">
          <span className="text-green-600 mt-0.5 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}