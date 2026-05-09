import { useState, useRef, useEffect } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useApiClient } from "@/lib/authFetch";
import { useAuth } from "@clerk/clerk-react";


interface LocationCardProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export function LocationCard({ location, onLocationChange }: LocationCardProps) {
  const { userId } = useAuth();
  const { apiClient } = useApiClient();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(location);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  async function handleSave() {
    if (!draft.trim() || draft === location || !userId) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setIsEditing(false);
    onLocationChange(draft);

    try {
      await apiClient.patch(`/dashboard/${userId}/location`, { location: draft });
    } catch {
      onLocationChange(location);
    } finally {
      setIsSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setDraft(location);
      setIsEditing(false);
    }
  }

  return (
    <>
      <div className="flex-1 flex flex-col items-start p-6 gap-4">
        <h2>{location || "London, UK"} </h2>
        <p>
          Spring in {location || "London"} is a wonderful time for
          gardening!
        </p>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. London, UK"
              className="w-48"
            />
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setDraft(location);
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            className="rounded-fulll bg-accent2"
            variant="secondary"
            onClick={() => setIsEditing(true)}
          >
            {isSaving ? "Saving..." : "Change location"}
          </Button>
        )}
      </div>
    </>
  );
}

