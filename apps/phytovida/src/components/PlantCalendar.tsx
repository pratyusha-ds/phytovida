import { useState, useEffect } from "react";
import { Calendar } from "@repo/ui/components/calendar";
import { useApiClient } from "@/lib/authFetch";
import type { ApiSuccess } from "@repo/types";

interface PlantLog {
  id: number;
  userPlantId: number;
  wateredAt: string;
  activity?: string;
}

export function PlantCalendar({ plantId }: { plantId?: string }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [logs, setLogs] = useState<PlantLog[]>([]);
  const { apiClient } = useApiClient();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const url = plantId ? `/my-plants/${plantId}/logs` : `/my-plants/logs`;
        const response = (await apiClient.get(url)) as {
          data: ApiSuccess<PlantLog[]>;
        };

        if (response.data && Array.isArray(response.data)) {
          setLogs(response.data);
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          setLogs(response.data.data);
        }
      } catch (err) {
        console.error("Could not load calendar logs:", err);
      }
    };

    fetchLogs();
  }, [plantId, apiClient]);

  const highlightedDays = logs.map((log) => {
    const d = new Date(log.wateredAt);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  const selectedDayLogs = logs.filter(
    (l) =>
      new Date(l.wateredAt).toDateString() === selectedDate?.toDateString(),
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-full md:max-w-md mx-auto pb-10 px-4 md:px-0">
      <div className="w-full">
        <Calendar
          className="w-full bg-divider rounded-2xl p-4 shadow-sm"
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{ hasData: highlightedDays }}
          modifiersClassNames={{
            hasData:
              "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-accent3 after:rounded-full after:content-['']",
          }}
        />
      </div>

      <div className="bg-accent3/5 rounded-2xl border border-accent3/20 overflow-hidden shadow-sm">
        <div className="bg-accent3/10 px-4 py-3 border-b border-accent3/20 flex items-center justify-between">
          <h4 className="text-[10px] font-bold text-accent3 uppercase tracking-[0.15em]">
            Plant Activity
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-accent3/80 bg-white/50 px-2 py-0.5 rounded-full">
              {selectedDate?.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="min-h-45 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
            {selectedDayLogs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {selectedDayLogs.map((log) => (
                  <div
                    key={log.id}
                    className="group flex items-center gap-4 p-3 bg-white/40 hover:bg-white/80 rounded-xl border border-accent3/10 transition-all"
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-accent3 shadow-[0_0_5px_rgba(var(--accent3-rgb),0.4)]" />

                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-800">
                        {log.activity || "Watering Session"}
                      </span>
                      <span className="text-[10px] text-accent3/60 font-medium">
                        Completed at{" "}
                        {new Date(log.wateredAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-45 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] font-bold text-accent3/40 uppercase tracking-widest">
                  No activity yet
                </p>
                <p className="text-[10px] text-accent3/30 mt-1">
                  Select a marked day to see logs
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-4 w-full" />
    </div>
  );
}
