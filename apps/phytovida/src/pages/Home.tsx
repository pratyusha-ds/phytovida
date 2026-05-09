import { Button } from "@repo/ui/components/button";
import { Link } from "react-router"


export default function Home() {


	return (
		<section className="w-full space-y-10  md:mt-32">
			<div className="h-full grid max-w-5xl mx-auto w-full flex flex-col gap-10 px-5">
				<h1 className="flex text-center text-headline md:text-8xl">
					Now Every Plant Can Thrive
				</h1>
				<div className="relative flex justify-center">

					<div className="bg-accent2 absolute inset-y-0 left-0 right-0 top-[30%] rounded-3xl"></div>
					<img
						src="/homepage_plant.jpeg"
						alt="Two dark green leaves against a grey background"
						className="relative rounded-t-3xl w-[75%] object-cover border-t-9 border-l-9 border-r-9 border-black" />
				</div>

				<div className="flex flex-col gap-4 py-10">
					<h2 className="text-accent6 text-2xl max-w-xl"></h2>
					<p className="text-accent2">How it works</p>
					<h3 className="text-4xl max-w-xl">Healthy plants start here</h3>
				</div>
				<div className="grid grid-col-2 md:grid-cols-4 gap-4">
					<div>
						<h4 className="py-4">Track your plants</h4>
						<p>Add plants from our library to your garden to track what you're growing and what you want to grow next.</p>
					</div>
					<div>
						<h4 className="py-4">Schedule your watering</h4>
						<p>Set watering frequency for each plant and add reminders so you'll never forget to water your plants again.</p>
					</div>
					<div>
						<h4 className="py-4">Check plant health</h4>
						<p>Upload a photo of your plant to get an instant AI diagnosis and discover treatment suggestions</p>
					</div>
					<div>
						<h4 className="py-4">Get inspiration</h4>
						<p>Browse our plant library for information on your favourite plants and inspiration on what to grow next.</p>
					</div>
				</div>

				<div className="flex flex-col items-center gap-4 pt-20 pb-10">
					<div className="flex flex-col items-center gap-4 py-20">
						<h2 className="text-center text-5xl">Ask AI</h2>
						<p>Get instant AI-powered help to diagnose common pests and diseases.</p>
					</div>
					<div>
						<img
							src="/homepage_plant2.jpeg"
							alt="Light green leaves and white flowers against a grey background"
							className="rounded-2xl object-cover" />

					</div>
					<Button className="rounded-full bg-accent1 text-white mt-20 px-20" variant="secondary" asChild>
						<Link to="/ask-AI">Ask AI</Link>
					</Button>
				</div>

				<div className="flex flex-col items-center gap-4 pt-20 pb-10">
					<h2 className="text-center text-5xl">Plant Library</h2>
					<p>Browse the plant library and discover sunlight, watering and hardiness information.</p>
				</div>

				<div className="flex flex-col items-center gap-4">
					<div className="flex flex-col md:flex-row items-center gap-8">
						<div className="w-full md: w-1/2">
							<img
								src="/homepage_plant.jpeg"
								alt="Two dark green leaves against a grey background"
								className="rounded-2xl object-cover"
							/>
						</div>
						<div className="w-full md: w-1/2">
							<h3>Monstera deliciosa</h3>
							<h4 className="text-accent6 pb-8">Swiss cheese plant</h4>
							<p>Native to the tropical rainforests of Central America, the monstera deliciosa is one of the most recognisable houseplants in the world. It's beloved for its large, glossy, heart-shaped leaves that develop distinctive splits and holes (called fenestrations) as the plant matures — hence the "Swiss cheese" nickname.</p>
						</div>
					</div>

					<Button className="rounded-full bg-accent1 text-white mt-20 px-20" variant="secondary" asChild>
						<Link to="/plant-library">Discover more</Link>
					</Button>
				</div>
			</div>

		</section>

	);

}