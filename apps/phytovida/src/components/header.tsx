import logo from "@/assets/logo.svg";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { Button } from "@repo/ui/components/button";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState } from "react";

export function Header() {
	const { isSignedIn } = useAuth();
	const location = useLocation();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="relative flex justify-between items-center py-4 px-5">
			<img src={logo} alt="pythovida logo" />

			{/* Desktop nav */}
			<nav className="hidden md:flex gap-6 px-6 py-2">
				<Link
					to="/my-garden"
					className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">
					My Garden
				</Link>
				<Link
					to="/"
					className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">
					Plant Library
				</Link>
				<Link
					to="/"
					className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">
					Guides
				</Link>
				<Link
					to="/"
					className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">
					Community
				</Link>
			</nav>

			{/* Desktop auth button */}
			<div className="hidden md:block">
				{!isSignedIn ? (
					<Button className="rounded-full" asChild>
						<Link to="/auth/sign-in" state={{ from: location.pathname }}>
							<span className="sr-only">Log in</span>
							Log in
							<ArrowUpRight />
						</Link>
					</Button>
				) : (
					<UserButton
						appearance={{
							elements: {
								userButtonAvatarBox:
									"w-10 h-10 rounded-full border border-accent2",
							},
						}}
					/>
					//   <SignOutButton>
					//     <Button
					//       variant='destructive'
					//       className='rounded-full'
					//     >
					//       <span className='sr-only'>Log out</span>
					//       Log out
					//       <LogOut />
					//     </Button>
					//   </SignOutButton>
				)}
			</div>

			{/* Mobile nav */}
			<div className="md:hidden">
				<button
					className="hamburger"
					onClick={() => setMenuOpen((prev) => !prev)}
					aria-label="Toggle menu">
					{menuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* Mobile dropdown menu */}
			{menuOpen && (
				<div className="absolute top-full left-0 right-0 z-50 bg-background border-t flex flex-col px-5 py-4 gap-4 md:hidden shadow-md">
					<Link
						to="/"
						className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">
						My Garden
					</Link>
					<Link
						to="/"
						className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">
						Plant Library
					</Link>
					<Link
						to="/"
						className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">
						Guides
					</Link>
					<Link
						to="/"
						className="font-sans text-sm font-bold text-base text-accent4 hover:text-link transition-colors duration-200">
						Community
					</Link>

					<div>
						{!isSignedIn ? (
							<Button className="rounded-full" asChild>
								<Link to="/auth/sign-in" state={{ from: location.pathname }}>
									<span className="sr-only">Log in</span>
									Log in
									<ArrowUpRight />
								</Link>
							</Button>
						) : (
							<UserButton
								appearance={{
									elements: {
										userButtonAvatarBox: "w-10 h-10 border border-border",
									},
								}}
							/>
							// <SignOutButton>
							// 	<Button variant="destructive" className="rounded-full">
							// 		<span className="sr-only">Log out</span>
							// 		Log out
							// 		<LogOut />
							// 	</Button>
							// </SignOutButton>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
