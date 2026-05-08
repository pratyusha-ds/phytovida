import { useRef, useEffect } from "react";
import { Loader2, Droplets, AlertCircle } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@repo/ui/components/sheet";
import { useUserPlantLogs } from "@/hooks/user-plant-logs/useUserPlantLogs";
import { Button } from "@repo/ui/components/button";
import LogWateringDialog from "./LogWateringDialog";

interface PlantWateringLogsContentProps {
	userPlantId?: number;
	plantName?: string;
}

export function PlantWateringLogsContent({
	userPlantId,
	plantName = "Plant",
}: PlantWateringLogsContentProps) {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
		refetch,
		fetchStatus,
	} = useUserPlantLogs(Number(userPlantId));

	const observerTarget = useRef<HTMLDivElement>(null);

	// Infinite scroll intersection observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (
					entries[0].isIntersecting &&
					hasNextPage &&
					!isFetchingNextPage &&
					!isLoading
				) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

	const logs = data?.pages.flatMap((page) => page.data) ?? [];

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	console.log("asd");
	if (isError) {
		return (
			<div className="rounded-lg mx-5 border border-destructive/50 bg-destructive/10 p-4">
				<div className="flex items-start gap-3">
					<AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
					<div>
						<h5 className="font-semibold text-destructive">
							Failed to load watering logs
						</h5>
						<p className="text-sm text-destructive/80">
							{error?.message || "Something went wrong. Please try again."}
						</p>
						<Button
							disabled={fetchStatus === "fetching"}
							variant="default"
							className="bg-accent3 hover:bg-accent3/80 mt-2"
							size="sm"
							onClick={() => refetch()}>
							{fetchStatus === "fetching" ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Retry"
							)}
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (logs.length === 0) {
		return (
			<div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
				<Droplets className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
				<h3 className="font-semibold text-foreground mb-1">
					No watering logs yet
				</h3>
				<p className="text-sm text-muted-foreground">
					Time to water {plantName}!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-0 divide-y divide-border">
			{logs.map((log, index) => (
				<div
					key={log.id}
					className="flex  items-center justify-between gap-4 p-4 hover:bg-accent1/10 transition-colors">
					<div className="min-w-0 flex-1">
						<time className="text-sm font-medium text-foreground block">
							{new Date(log.wateredAt).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</time>
						<time className="text-xs text-muted-foreground block">
							{new Date(log.wateredAt).toLocaleTimeString("en-US", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</time>
					</div>
					{index === 0 && (
						<span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
							Last Watered
						</span>
					)}
				</div>
			))}

			{/* Infinite scroll trigger */}
			<div ref={observerTarget} className="flex justify-center py-4">
				{isFetchingNextPage && (
					<Loader2 className="h-6 w-6 animate-spin text-primary" />
				)}
			</div>

			{!hasNextPage && logs.length > 0 && (
				<div className="text-center py-4">
					<p className="text-sm text-muted-foreground">No more logs to load</p>
				</div>
			)}
		</div>
	);
}

interface PlantWateringLogsProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userPlantId: number;
	plantName?: string;
}

export function PlantWateringLogs({
	open,
	onOpenChange,
	userPlantId,
	plantName = "Plant",
}: PlantWateringLogsProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="flex flex-col w-full sm:max-w-sm">
				<SheetHeader>
					<div className="flex items-start   gap-2 ">
						<Droplets className="h-14 w-14 text-cyan-600" />
						<SheetTitle className="max-w-[75%] text-2xl">
							Watering logs for {plantName}
						</SheetTitle>{" "}
					</div>
				</SheetHeader>
				<div className="flex-1 overflow-y-auto  ">
					<PlantWateringLogsContent
						userPlantId={userPlantId}
						plantName={plantName}
					/>
				</div>
				<SheetFooter>
					<LogWateringDialog plantName={plantName} userPlantId={userPlantId} />
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
