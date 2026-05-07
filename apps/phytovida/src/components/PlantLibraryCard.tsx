import { useUser } from "@clerk/clerk-react";
import { Droplets, Thermometer, Sun } from "lucide-react";
import CreateUserPlantForm from "@/components/UserPlantCreation/CreateUserPlantForm";
import type { DbPlant } from "@repo/types";
import { useState } from "react";
import { Link } from "react-router";

const PLACEHOLDER_IMAGE =
  "https://img.freepik.com/free-vector/green-botany-flat-bush-vector_53876-164108.jpg";

function parseHardiness(hardiness: string | null | undefined) {
  if (!hardiness) return null;
  try {
    return JSON.parse(hardiness) as { min: string; max: string };
  } catch {
    return null;
  }
}

export function PlantLibraryCard({
  id,
  name,
  imageUrl,
  hardiness,
  watering,
  sunlight,
}: DbPlant) {
  const { isSignedIn } = useUser();
  const zones = parseHardiness(hardiness);

  const [imgFailed, setImgFailed] = useState(false);

  const src = !imageUrl || imgFailed ? PLACEHOLDER_IMAGE : imageUrl;
  return (
    <Link
      to={`/plant-library/${id}`}
      className="rounded-lg border group overflow-hidden relative md:w-[90%] w-[90dvw] h-99.5 shadow-sm mx-auto"
    >
      <div className="rounded-lg border group overflow-hidden relative md:w-[90%] w-[90dvw] h-99.5 shadow-sm mx-auto">
        <img
          className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={src}
          onError={() => setImgFailed(true)}
          alt={name}
        />
        <div className="absolute p-5 bg-white/50 rounded-t-2xl backdrop-blur-xs h-28 translate-y-28 transition-all duration-500 group-hover:translate-y-0 bottom-0 left-0 w-full">
          <div className="flex items-start justify-between h-full">
            <div className="flex flex-col gap-2 items-start gap-1 min-w-0 max-w-[55%]">
              <h2 className="text-2xl truncate w-full">{name}</h2>
              {isSignedIn && (
                <div onClick={(e) => e.stopPropagation()}>
                  <CreateUserPlantForm plantId={id} name={name} />
                </div>
              )}
            </div>

            <div className="flex flex-col items-end justify-between h-full">
              {zones && (
                <div className="flex gap-2 items-center">
                  <Thermometer size={14} className="text-accent4" />
                  <p className="text-sm text-accent4">
                    {zones.min} – {zones.max}°C
                  </p>
                </div>
              )}

              {watering && (
                <div className="flex gap-0.5 items-center">
                  <Droplets className="text-blue-900" size={14} />
                  <p className="text-sm text-accent4">
                    <span className="font-medium">{watering}</span>
                  </p>
                </div>
              )}

              {sunlight && (
                <div className="flex gap-0.5 items-center">
                  <Sun className="text-yellow-400" size={14} />
                  <p className="text-sm text-accent4">
                    <span className="font-medium">{sunlight}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
