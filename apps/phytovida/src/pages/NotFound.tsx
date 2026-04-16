import { Link } from "react-router";
import { Leaf, ArrowRight } from "lucide-react";

export default function NotFound() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-4">
			<div className="text-center max-w-2xl">
				{/* Animated plant illustration */}
				<div className="mb-8 inline-flex relative">
					<div className="text-8xl animate-bounce">🌱</div>
					<div className="absolute inset-0 animate-pulse">
						<Leaf className="w-24 h-24 text-emerald-600 opacity-30" />
					</div>
				</div>

				{/* 404 Text */}
				<div className="mb-6">
					<h1 className="text-7xl md:text-8xl font-bold text-emerald-900 mb-2">
						404
					</h1>
					<p className="text-2xl md:text-3xl font-semibold text-emerald-800 mb-4">
						Page Not Found
					</p>
					<p className="text-lg text-emerald-700 mb-8 leading-relaxed">
						Looks like this plant has wilted away. Don&apos;t worry, let&apos;s
						get you back to growing.
					</p>
				</div>

				{/* Decorative line */}
				<div className="flex gap-2 justify-center mb-8">
					<div className="w-12 h-1 bg-emerald-600 rounded-full"></div>
					<div className="w-12 h-1 bg-green-500 rounded-full"></div>
					<div className="w-12 h-1 bg-emerald-400 rounded-full"></div>
				</div>

				{/* CTA Button */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link
						to="/"
						className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
						<span>Back to Home</span>
						<ArrowRight className="w-5 h-5" />
					</Link>
					<Link
						to="/"
						className="inline-flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 text-emerald-600 font-semibold py-3 px-8 rounded-lg border-2 border-emerald-600 transition-colors duration-200">
						<span>Explore PhytoVida</span>
					</Link>
				</div>

				{/* Footer message */}
				<div className="mt-12 pt-8 border-t border-emerald-300">
					<p className="text-sm text-emerald-700">
						Need help? Check out our{" "}
						<Link
							to="/"
							className="underline hover:text-emerald-900 font-semibold">
							community forum
						</Link>{" "}
						or{" "}
						<Link
							to="/"
							className="underline hover:text-emerald-900 font-semibold">
							knowledge base
						</Link>
					</p>
				</div>
			</div>

			{/* Decorative leaf shapes */}
			<div className="fixed top-10 left-10 text-green-200 opacity-40 pointer-events-none">
				<Leaf className="w-32 h-32 animate-pulse" />
			</div>
			<div className="fixed bottom-10 right-10 text-emerald-200 opacity-40 pointer-events-none">
				<Leaf
					className="w-32 h-32 animate-pulse"
					style={{ animationDelay: "1s" }}
				/>
			</div>
		</div>
	);
}
