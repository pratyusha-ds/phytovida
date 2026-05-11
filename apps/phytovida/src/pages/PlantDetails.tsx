// pages/PlantDetails.tsx
import { useParams, Link } from "react-router";
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Droplets, Thermometer, Sun, ArrowLeft } from "lucide-react";
import { usePlantDetails } from "@/hooks/plant-library/usePlantDetails";
import CreateUserPlantForm from "@/components/UserPlantCreation/CreateUserPlantForm";

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

export default function PlantDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = usePlantDetails(id);
  const { isSignedIn } = useUser();
  const [imgFailed, setImgFailed] = useState(false);

  if (isLoading) {
    return (
      <section className="max-w-5xl mx-auto px-8 py-20">
        <p className="text-center">Loading plant...</p>
      </section>
    );
  }

  if (error || !data?.data) {
    return (
      <section className="max-w-5xl mx-auto px-8 py-20">
        <p className="text-center text-red-500">
          {error ? (error as Error).message : "Plant not found"}
        </p>
        <div className="flex justify-center mt-6">
          <Link to="/plant-library" className="underline">
            Back to library
          </Link>
        </div>
      </section>
    );
  }

  const plant = data.data;
  const zones = parseHardiness(plant.hardiness);
  const src = !plant.imageUrl || imgFailed ? PLACEHOLDER_IMAGE : plant.imageUrl;

  return (
    <section className="max-w-5xl mx-auto px-8 py-12 md:mt-32 space-y-10">
      <Link
        to="/plant-library"
        className="inline-flex items-center gap-2 text-accent6 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to library
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl overflow-hidden border">
          <img
            src={src}
            alt={plant.name ?? "Plant"}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-headline text-5xl md:text-6xl">{plant.name}</h1>

          <div className="flex flex-col gap-3">
            {zones && (
              <div className="flex gap-2 items-center">
                <Thermometer size={20} className="text-accent4" />
                <p className="text-lg">
                  Hardiness zones: {zones.min} – {zones.max }°C
                </p>
              </div>
            )}
            {plant.watering && (
              <div className="flex gap-2 items-center">
                <Droplets size={20} className="text-blue-900" />
                <p className="text-lg">
                  Watering:{" "}
                  <span className="font-medium">{plant.watering}</span>
                </p>
              </div>
            )}
            {plant.sunlight && (
              <div className="flex gap-2 items-center">
                <Sun size={20} className="text-yellow-400" />
                <p className="text-lg">
                  Sunlight:{" "}
                  <span className="font-medium">{plant.sunlight}</span>
                </p>
              </div>
            )}
          </div>

          {isSignedIn && (
            <div className="mt-4">
              <CreateUserPlantForm plantId={plant.id} name={plant.name} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
