import logo from "@/assets/logo.svg";
import { SignOutButton, useAuth } from "@clerk/react";
import { Button } from "@repo/ui/components/button";
import { ArrowUpRight, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Header() {
	const { isSignedIn } = useAuth();
	const location = useLocation();

	return (
		<header className="flex justify-between items-center py-4 px-5">
			<img src={logo} alt="pythovida logo" />

			<nav>
				{/* // TODO: Add navigation links and other header elements and make it responsive */}
				<Link to="/" className="text-gray-600 hover:text-gray-900">
					Home
				</Link>
			</nav>
			{!isSignedIn ? (
				<Button className="rounded-full" asChild>
					<Link to="/auth/sign-in" state={{ from: location.pathname }}>
						<span className="sr-only">Log in</span>
						Log in
						<ArrowUpRight />
					</Link>
				</Button>
			) : (
				<SignOutButton>
					<Button variant="destructive" className="rounded-full">
						<span className="sr-only">Log out</span>
						Log out
						<LogOut />
					</Button>
				</SignOutButton>
			)}
		</header>
	);
}
