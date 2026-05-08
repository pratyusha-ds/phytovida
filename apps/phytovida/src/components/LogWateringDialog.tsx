import { useCreateUserPlantLog } from "@/hooks/user-plant-logs/useUserPlantLogs";
import { Button } from "@repo/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/ui/components/dialog";
import { Droplets, Loader2 } from "lucide-react";
import { useState } from "react";

interface LogWateringDialogProps {
	plantName: string;
	userPlantId: number;
}

export default function LogWateringDialog({
	plantName,
	userPlantId,
}: LogWateringDialogProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	// Mutation to add a new watering log
	const addWateringLogMutation = useCreateUserPlantLog();

	const handleAddWateringLog = () => {
		addWateringLogMutation.mutate(
			{ userPlantId },
			{
				onSuccess: () => {
					setDialogOpen(false);
					// Optionally, you can refetch the logs here if you have a query for them
				},
			},
		);
	};

	return (
		<>
			<Button
				onClick={() => setDialogOpen(true)}
				// className="inline-flex items-center gap-2 rounded-lg bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
				className="bg-accent3">
				<Droplets className="h-4 w-4" />
				Log Watering
			</Button>
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="w-full sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Log Watering</DialogTitle>
						<DialogDescription>Did you water {plantName}?</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 flex-col-reverse sm:flex-row">
						<Button
							onClick={() => setDialogOpen(false)}
							className=""
							variant="destructive">
							Cancel
						</Button>
						<Button
							onClick={handleAddWateringLog}
							disabled={addWateringLogMutation.isPending}
							className="bg-accent3">
							{addWateringLogMutation.isPending && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
