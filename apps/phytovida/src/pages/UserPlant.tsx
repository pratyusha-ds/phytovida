import PlantNotFound from "@/components/PlantNotFound";
import { PlantWateringLogs } from "@/components/PlantWateringLogs";
import { useUserPlant } from "@/hooks/user-plants/useUserPlant";
import { Button } from "@repo/ui/components/button";
import { useState } from "react";
import { useParams } from "react-router";
import { Sprout, Trash2, Droplets, Leaf, CircleArrowRight } from "lucide-react";
import WateringFrequencyNotSetCard from "@/components/UserPlantUpdate/WateringFrequencyNotSetCard";
import WateringFrequencyEdit from "@/components/UserPlantUpdate/WateringFrequencyEdit";
import AlertCard from "@/components/AlertCard";

export default function UserPlant() {
	const { userPlantId } = useParams();
	const [logsOpen, setLogsOpen] = useState(false);
	const { isLoading, data } = useUserPlant(userPlantId!);
	const [editMode, setEditMode] = useState(false);
	const isGrowing = false;

	const [phaseChangeAlertOpen, setPhaseChangeAlertOpen] = useState(false);
	const [plantDeleteAlertOpen, setPlantDeleteAlertOpen] = useState(false);

	// TODO: replace loading UI
	if (isLoading || !userPlantId) return "loading...";

	if (!data?.data) return <PlantNotFound />;

	const plant = data?.data;
	return (
		<div className="p-5 m-auto">
			<h1 className="text-center md:text-7xl">{plant.plantName}</h1>

			<img
				className="h-96 w-full object-center object-cover lg:rounded-4xl rounded-t-4xl mt-16"
				alt={plant.plantName}
				src={
					plant.plantImg ||
					"https://img.freepik.com/free-vector/green-botany-flat-bush-vector_53876-164108.jpg?semt=ais_hybrid&w=740&q=80"
				}
			/>

			<section className="w-full p-8 border-2 border-solid rounded-4xl mt-8">
				<div className="flex items-center gap-2">
					{isGrowing ?
						<div className="flex items-center gap-1 border-2 p-2 rounded-xl bg-primary text-white text-xs">
							<Sprout className="w-4 h-4" /> Growing
						</div>
						:
						<div className="flex items-center gap-1 border-2 border-orange-600 p-2 rounded-xl bg-orange-100 text-orange-600 text-xs">
							<Leaf className="w-4 h-4" /> Planning
						</div>

					}
					{!isGrowing && <>
						<Button
							onClick={() => setPhaseChangeAlertOpen(true)}
							className="cursor-pointer bg-transparent hover:bg-transparent hover:pl-4 border-dashed border-b-4 text-primary shadow-none"
						>Mark as growing <CircleArrowRight /></Button>
						<AlertCard
							open={phaseChangeAlertOpen}
							setOpen={setPhaseChangeAlertOpen}
							title="Has it actually been planted?"
							description={`Marking ${plant.plantName} as growing will start watering reminders.`}
							discardButton={{ text: "Not yet" }}
							actionButton={{ text: "Yes, it's growing", bgColor: "bg-primary" }}
						/>
					</>}
					<Button
						onClick={() => setPlantDeleteAlertOpen(true)}
						variant="ghost"
						className="ml-auto bg-transparent border-0 shadow-none hover:bg-transparent p-0 text-red-500 hover:text-red-500 hover:bg-red-100">
						<Trash2 />Remove
					</Button>
					<AlertCard
						open={plantDeleteAlertOpen}
						setOpen={setPlantDeleteAlertOpen}
						title="Remove from your garden?"
						description={`${plant.plantName} and its watering history will be removed from your garden. This can’t be undone.`}
						discardButton={{ text: "Keep it" }}
						actionButton={{ text: "Remove from garden", bgColor: "bg-red-800" }}
					/>
				</div>
				<div className="mt-4 p-6 rounded-xl bg-gray-100 pb-12">
					<div className="flex gap-2 items-center text-primary"><Droplets className="w-4 h-4" />Watering frequency</div>
					{/* cases: */}
					{/* 1. Watering Frequency not set */}

					{/* 2. Showing Watering Frequency */}
					{/* <WateringFrequencyCard /> */}

					{/* 3. Edit Watering Frequency */}
					{editMode
						?
						<WateringFrequencyEdit setEditMode={setEditMode} />
						:
						<WateringFrequencyNotSetCard setEditMode={setEditMode} />
					}
				</div>
			</section >

			{/* Actions Section */}
			< section className="w-full px-4 py-12 sm:px-6 lg:px-8" >
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
			</ section >

			{/* Watering Logs Sheet */}
			< PlantWateringLogs
				open={logsOpen}
				onOpenChange={setLogsOpen}
				plantName={plant.plantName}
				userPlantId={Number(userPlantId)}
			/>
		</div >
	);
}
