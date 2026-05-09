import PlantNotFound from "@/components/PlantNotFound";
import { PlantWateringLogs } from "@/components/PlantWateringLogs";
import { useDeleteUserPlant, useUpdateUserPlantFields, useUserPlant } from "@/hooks/user-plants/useUserPlant";
import { Button } from "@repo/ui/components/button";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Sprout, Trash2, Droplets, Leaf, CircleArrowRight, TriangleAlert, ArrowRight, ArrowLeft } from "lucide-react";
import WateringFrequencyNotSetCard from "@/components/UserPlantUpdate/WateringFrequencyNotSetCard";
import WateringFrequencyEdit from "@/components/UserPlantUpdate/WateringFrequencyEdit";
import AlertCard from "@/components/AlertCard";
import WateringFrequencyCard from "@/components/UserPlantUpdate/WateringFrequencyCard";
import FeedbackCard from "@/components/FeedbackCard";

export default function UserPlant() {
	const navgiate = useNavigate();

	const { userPlantId } = useParams();

	const [logsOpen, setLogsOpen] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [phaseChangeAlertOpen, setPhaseChangeAlertOpen] = useState(false);
	const [plantDeleteAlertOpen, setPlantDeleteAlertOpen] = useState(false);

	const { isLoading, data } = useUserPlant(userPlantId!);
	const updateWateringFrequency = useUpdateUserPlantFields();
	const updatePhase = useUpdateUserPlantFields();
	const deletePlant = useDeleteUserPlant();


	// TODO: replace loading UI
	if (isLoading || !userPlantId) return "loading...";

	if (!data?.data) return <PlantNotFound />;

	const plant = data?.data;


	const handlePhaseChanged = () => {
		updatePhase.mutate({
			userPlantId,
			body: {
				fields: [{ name: "phase", value: "growing" }]
			}
		}, {
			onSettled: () => {
				setPhaseChangeAlertOpen(false);
			}
		}
		);
	}

	const handlePlantDelete = () => {
		deletePlant.mutate({
			userPlantId
		}, {
			onSuccess: () => {
				navgiate("/my-garden")
			},
			onError: () => {
				setPlantDeleteAlertOpen(false);
			}
		}
		)
	}

	return (
		<div className="mt-10 px-4 md:px-8">
			<Link
				to="/my-garden"
				className="inline-flex items-center gap-2 text-accent6 hover:underline mb-10"
			>
				<ArrowLeft size={16} />
				Back to My Garden
			</Link>
			<h2 className="lg:hidden text-5xl mb-6">{plant.plantName}</h2>
			<div className="flex flex-col lg:flex-row gap-10">
				<img
					className="w-full h-80 lg:h-96 object-cover lg:flex-1 aspect-square rounded-2xl overflow-hidden border"
					alt={plant.plantName}
					src={
						plant.plantImg ||
						"https://img.freepik.com/free-vector/green-botany-flat-bush-vector_53876-164108.jpg?semt=ais_hybrid&w=740&q=80"
					}
				/>
				<div className="flex-2">
					<h2 className="hidden lg:inline lg:text-6xl">{plant.plantName}</h2>
					<div className="w-full p-8 border-2 border-solid rounded-4xl mt-8 shadow-xl">
						<section>
							<div className="flex items-center gap-2">
								{plant.phase === "growing"
									?
									<div className="flex items-center gap-1 border-2 p-2 rounded-xl bg-primary text-white text-xs">
										<Sprout className="w-4 h-4" /> Growing
									</div>
									:
									<div className="flex items-center gap-1 border-2 border-orange-600 p-2 rounded-xl bg-orange-100 text-orange-600 text-xs">
										<Leaf className="w-4 h-4" /> Planning
									</div>

								}
								{plant.phase === "planning" && <>
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
										actionButton={{
											text: "Yes, it's growing",
											bgColor: "bg-primary",
											onClickHandler: handlePhaseChanged
										}}
										isLoading={updatePhase.isPending}
									/>
									{updatePhase.isError &&
										(
											updatePhase.error?.status !== undefined &&
												updatePhase.error.status < 500
												? <FeedbackCard
													icon={{ icon: <TriangleAlert />, bgColor: "bg-orange-600" }}
													title={"Your details need a tweak"}
													description={{ text: "Some details didn't look right. Please review and try again.", color: "text-orange-600" }}
												/>
												: <FeedbackCard
													icon={{ icon: <TriangleAlert />, bgColor: "bg-red-800" }}
													title={"We couldn't update your plant"}
													description={{ text: "We couldn't reach the garden service. Please try again in a moment.", color: "text-red-800" }}
												/>
										)
									}
								</>}
								<AlertCard
									open={plantDeleteAlertOpen}
									setOpen={setPlantDeleteAlertOpen}
									title="Remove from your garden?"
									description={`${plant.plantName} and its watering history will be removed from your garden. This can’t be undone.`}
									discardButton={{ text: "Keep it" }}
									actionButton={{
										text: "Remove from garden", bgColor: "bg-red-800",
										onClickHandler: handlePlantDelete
									}}
									isLoading={deletePlant.isPending}
								/>
								{
									deletePlant.isError && <FeedbackCard
										icon={{ icon: <TriangleAlert />, bgColor: "bg-red-800" }}
										title={"We couldn't delete your plant"}
										description={{ text: "We couldn't reach the garden service. Please try again in a moment.", color: "text-red-800" }}
									/>
								}
							</div>
							<div className="mt-4 p-6 rounded-xl bg-gray-100 pb-12">
								<div className="flex gap-2 items-center text-primary"><Droplets className="w-4 h-4" />Watering frequency</div>
								{editMode
									?
									<WateringFrequencyEdit
										setEditMode={setEditMode}
										userPlantId={plant.id}
										defaultValue={plant.wateringFrequency}
										updateUserPlantFields={updateWateringFrequency}
									/>
									:
									plant.wateringFrequency ?
										<WateringFrequencyCard
											wateringFrequency={plant.wateringFrequency}
											setEditMode={setEditMode}
										/>
										:
										<WateringFrequencyNotSetCard setEditMode={setEditMode} />
								}
							</div>
						</section >

						{/* Actions Section */}
						< section >
							<div className="mt-4 p-6 rounded-xl bg-gray-100 pb-12">
								<div className="flex flex-col gap-4 items-start">

									<div className="flex gap-2 items-center text-primary"><Droplets className="w-4 h-4" />Watering history</div>

									<div className="w-full sm:w-auto">
										<p className="text-sm text-black">
											Track and manage your plant&apos;s watering schedule
										</p>
									</div>

									<Button
										onClick={() => setLogsOpen(true)}
										className="flex-auto">
										<ArrowRight className="h-5 w-5" />
										View Watering Logs
									</Button>

								</div>
							</div>
						</ section >
						<section className="flex justify-end">
							<Button
								onClick={() => setPlantDeleteAlertOpen(true)}
								variant="ghost"
								className="bg-transparent border-0 shadow-none hover:bg-transparent p-0 text-red-800 hover:text-red-800 hover:bg-red-100 mt-6">
								<Trash2 />Remove from my garden
							</Button>
						</section>
						{/* Watering Logs Sheet */}
						< PlantWateringLogs
							open={logsOpen}
							onOpenChange={setLogsOpen}
							plantName={plant.plantName}
							userPlantId={Number(userPlantId)}
						/>
					</div >

				</div>
			</div >
		</div>
	);
}
