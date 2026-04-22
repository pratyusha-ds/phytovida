import { useUserPlant } from "@/hooks/user-plants/useUserPlant";
import { useParams } from "react-router";

export default function UserPlant() {
	const { userPlantId } = useParams();

	const { isLoading, data } = useUserPlant(userPlantId!);

	if (isLoading || !data?.data) return "loading...";

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
		</div>
	);
}
