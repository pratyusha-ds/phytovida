import type { UserPlant } from "@repo/types";
import { Droplet, Droplets, Thermometer } from "lucide-react";
import { useNavigate } from "react-router";

export function UserPlantCard({
	id,
	lastWateredDate,
	plantName,
	plantImg = "https://img.freepik.com/free-vector/green-botany-flat-bush-vector_53876-164108.jpg?semt=ais_hybrid&w=740&q=80",
	minTemp,
	maxTemp,
	wateringFrequency,
}: UserPlant) {
	const navigate = useNavigate();
	return (
		<div
			onClick={() => navigate(`/my-garden/${id}`)}
			className="rounded-lg border group overflow-hidden relative   md:w-[90%] w-[90dvw] h-99.5  shadow-sm ">
			<img
				className="absolute  h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
				src={
					plantImg ||
					"https://img.freepik.com/free-vector/green-botany-flat-bush-vector_53876-164108.jpg?semt=ais_hybrid&w=740&q=80"
				}
				alt={plantName}
			/>
			<div className="absolute p-5 bg-white/50 rounded-t-2xl  backdrop-blur-xs h-28 translate-y-28 transition-all duration-500 group-hover:translate-y-0 bottom-0 left-0 w-full">
				<div className="flex items-center justify-between">
					<h2 className="text-2xl">{plantName}</h2>
					<div className="flex gap-2 items-center">
						<Thermometer size={14} className="text-gray-500" />
						<p className="text-sm">
							{minTemp}°C - {maxTemp}°C
						</p>
					</div>
				</div>
				<div className="flex  gap-0.5 items-center">
					<Droplets className="text-gray-500" size={14} />
					<p className="text-sm">
						Watering frequency:{" "}
						<span className="text-md font-medium  ">{wateringFrequency}</span>
					</p>
				</div>

				<div className="flex  gap-0.5 items-center">
					<Droplet className="text-gray-500" size={14} />
					<p className="text-sm">
						Last Watered:{" "}
						<span className="text-md font-medium ">
							{lastWateredDate
								? new Date(lastWateredDate).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})
								: "Don't have watering log yet."}
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export function UserPlantCardSkeleton() {
	return (
		<div className="rounded-lg overflow-hidden relative md:w-[90%] w-[90dvw] h-99.5 animate-pulse">
			{/* Image placeholder */}
			<div className="absolute h-full w-full bg-gray-300" />

			{/* Bottom content */}
			<div className="absolute p-5 bg-white/50 backdrop-blur-xs h-28 bottom-0 left-0 w-full">
				<div className="flex items-center justify-between">
					{/* Plant name */}
					<div className="h-6 w-32 bg-gray-300 rounded" />

					{/* Temperature */}
					<div className="h-4 w-20 bg-gray-300 rounded" />
				</div>

				{/* Watering frequency */}
				<div className="flex items-center gap-2 mt-2">
					<div className="h-4 w-4 bg-gray-300 rounded-full" />
					<div className="h-4 w-40 bg-gray-300 rounded" />
				</div>

				{/* Last watered */}
				<div className="flex items-center gap-2 mt-2">
					<div className="h-4 w-4 bg-gray-300 rounded-full" />
					<div className="h-4 w-36 bg-gray-300 rounded" />
				</div>
			</div>
		</div>
	);
}
