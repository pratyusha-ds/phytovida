import { PlantWateringLogs } from "@/components/PlantWateringLogs";
import { useUserPlant } from "@/hooks/user-plants/useUserPlant";
import { Button } from "@repo/ui/components/button";
import { Droplets } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

export default function UserPlant() {
	const { userPlantId } = useParams();
	const [logsOpen, setLogsOpen] = useState(false);
	const { isLoading, data } = useUserPlant(userPlantId!);

	if (isLoading || !data?.data || !userPlantId) return "loading...";

	const plant = data?.data;
	return (
		<div className="p-5">
			<h1 className="text-center md:text-7xl">{plant.plantName}</h1>
			<h4 className="text-accent6 text-3xl mx-auto text-center md:max-w-lg">
				Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident
				cupiditate ipsa corrupti!
			</h4>

			<img
				className="h-96 w-full object-center object-cover lg:rounded-4xl rounded-t-4xl mt-16"
				alt={plant.plantName}
				src={
					plant.plantImg ||
					"https://img.freepik.com/free-vector/green-botany-flat-bush-vector_53876-164108.jpg?semt=ais_hybrid&w=740&q=80"
				}
			/>

			{/* Actions Section */}
			<section className="w-full px-4 py-12 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					<div className="flex flex-col  gap-4 items-center  ">
						<Button
							onClick={() => setLogsOpen(true)}
							className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-3 font-medium hover:bg-primary/90 transition-colors">
							<Droplets className="h-5 w-5" />
							View Watering Logs
						</Button>

						<div className="w-full sm:w-auto text-center sm:text-left">
							<p className="text-sm text-muted-foreground">
								Track and manage your plant&apos;s watering schedule
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Watering Logs Sheet */}
			<PlantWateringLogs
				open={logsOpen}
				onOpenChange={setLogsOpen}
				plantName={plant.plantName}
				userPlantId={Number(userPlantId)}
			/>
		</div>
	);
}
