import { Button } from "@repo/ui/components/button";
import { Leaf } from "lucide-react";
import { Link } from "react-router";

export default function PlantNotFound() {
	return (
		<div className="min-h-[80dvh]    flex items-center justify-center px-4">
			<div className="text-center space-y-6 max-w-md">
				{/* Icon */}
				<div className="flex justify-center">
					<div className="relative w-24 h-24">
						<Leaf className="w-24 h-24 text-green-200 opacity-50" />
						<div className="absolute inset-0 flex items-center justify-center">
							<span className="text-5xl">🌿</span>
						</div>
					</div>
				</div>

				{/* Heading */}
				<div className="space-y-2">
					<h1 className="text-4xl font-bold text-gray-900">Plant Not Found</h1>
					<p className="text-gray-600">
						We couldn&apos;t find the plant you&apos;re looking for. It might
						have been removed or the link could be incorrect.
					</p>
				</div>

				{/* Description */}
				<p className="text-sm text-gray-500">
					Don&apos;t worry! Let&apos;s get you back on track. Browse your plant
					collection or return to the home page.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
					<Button asChild variant="default" size="lg">
						<Link to="/">Go Home</Link>
					</Button>
					<Button asChild variant="outline" size="lg">
						<Link to="/my-garden">Browse Garden</Link>
					</Button>
				</div>

				{/* Footer note */}
				<p className="text-xs text-gray-400 pt-4">
					Error Code: 404 Plant Not Found
				</p>
			</div>
		</div>
	);
}
