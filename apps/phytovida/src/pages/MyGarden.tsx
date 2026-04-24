import { ErrorUI } from "@/components/ErrorUI";
import MyPlantsLists from "@/components/MyPlantsLists";
import { UserPlantCardSkeleton } from "@/components/UserPlantCard";
import { WorkInProgress } from "@/components/WorkInProgress";
import { useApiClient } from "@/lib/authFetch";

import type { ApiPaginatedResponse, UserPlant } from "@repo/types";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";

export default function MyGarden() {
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [isShowPlanningPlants, setIsShowPlanningPlants] = useState(true);
	const [plants, setPlants] = useState<UserPlant[]>([]);
	const [totalPlants, setTotalPlants] = useState(0);
	const { apiClient } = useApiClient();
	const [error, setError] = useState("");
	const pageRef = useRef(1);
	const [hasNextPage, setHasNextPage] = useState(true);

	const observerRef = useRef<HTMLDivElement | null>(null);
	const limit = 10;

	const fetchPlants = useCallback(async () => {
		if (loading || !hasNextPage) return;

		try {
			setLoading(true);
			setError("");

			const data: ApiPaginatedResponse<UserPlant> = await apiClient.get(
				`/my-plants?page=${pageRef.current}&limit=${limit}`,
			);

			await new Promise((resolve) => setTimeout(resolve, 2000));

			setPlants((prev) => {
				// safety guard against duplicates
				const existingIds = new Set(prev.map((p) => p.id));
				const filtered = data.data.filter((p) => !existingIds.has(p.id));

				return [...prev, ...filtered];
			});

			setHasNextPage(data.pagination.hasNextPage);
			setTotalPlants(data.pagination.total);

			pageRef.current += 1;
		} catch (err) {
			setError((err as Error).message);
		} finally {
			setLoading(false);
			setInitialLoading(false);
		}
	}, [loading, hasNextPage]);

	// initial load
	useEffect(() => {
		fetchPlants();
	}, []);

	// infinite scroll trigger
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !loading && hasNextPage) {
					fetchPlants();
				}
			},
			{ threshold: 1 },
		);

		const el = observerRef.current;
		if (el) observer.observe(el);

		return () => {
			if (el) observer.unobserve(el);
		};
	}, [fetchPlants, loading, hasNextPage]);

	const tabClass = (active: boolean) =>
		cn(
			"rounded-full shadow-none",
			active
				? "bg-accent3 hover:bg-accent3/90"
				: "bg-accent3/60 hover:bg-accent3",
		);

	if (error) {
		return <ErrorUI message={error} onRetry={fetchPlants} />;
	}

	return (
		<section className="w-full space-y-10  md:mt-32 ">
			<div className="flex gap-10 items-center justify-center">
				<Button
					onClick={() => setIsShowPlanningPlants(true)}
					className={tabClass(isShowPlanningPlants)}>
					Growing
				</Button>
				<Button
					onClick={() => setIsShowPlanningPlants(false)}
					className={tabClass(!isShowPlanningPlants)}>
					Planning
				</Button>
			</div>
			<div className="flex flex-col items-center space-y-2 md:space-y-5">
				<h1 className="md:text-8xl">My Garden</h1>
				<h4 className="text-accent6 text-3xl text-center">
					{isShowPlanningPlants ? (
						<>
							{!totalPlants ? (
								"Start tracking your plants"
							) : (
								<>
									<span>
										Monitoring {loading ? 0 : plants.length}{" "}
										<br className="block md:hidden" /> plants in your <br />{" "}
										garden
									</span>
								</>
							)}
						</>
					) : (
						"Start your planting plan"
					)}
				</h4>
				{isShowPlanningPlants ? (
					!initialLoading && plants.length === 0 ? (
						<>
							<Button
								onClick={() => window.alert("Coming soon!")}
								className="bg-accent3 rounded-full mt-5 hover:bg-accent3/90">
								Add Plant
							</Button>
						</>
					) : (
						<>
							{/*  //TODO: Add Panel for planning to plant and growing plants, show only the active category (growing/planning) */}
							<MyPlantsLists loading={initialLoading} plants={plants} />

							{/*   Sentinel for infinite scroll */}
							<div ref={observerRef} className="h-10 w-full" />

							{/* Loading indicator */}
							{loading && (
								<div className="w-full -mt-20 flex justify-center mb-20">
									<UserPlantCardSkeleton />
								</div>
							)}

							{/* End state */}
							{!hasNextPage && plants.length > 0 && (
								<p className="text-sm text-gray-400 mb-20">
									No more plants to load
								</p>
							)}
						</>
					)
				) : (
					<>
						<WorkInProgress />
					</>
				)}
			</div>
		</section>
	);
}
