import type { UserPlant } from "@repo/types";
import { UserPlantCard, UserPlantCardSkeleton } from "./UserPlantCard";

interface MyPlantsListsProps {
	loading: boolean;
	plants: UserPlant[];
}

export default function MyPlantsLists({ loading, plants }: MyPlantsListsProps) {
	return (
		<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,500px))] justify-center gap-4 w-full">
			{loading
				? Array.from({ length: 5 }).map((_, index) => (
					<UserPlantCardSkeleton key={index} />
				))
				: plants.map((plant) => (
					<UserPlantCard key={`user-plant-card-${plant.id}`} {...plant} />
				))}
		</div>
	);
}
