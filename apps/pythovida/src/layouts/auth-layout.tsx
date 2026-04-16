import { useAuth } from "@clerk/react";
import { Navigate, Outlet } from "react-router";

export default function AuthLayout() {
	const { isSignedIn, isLoaded } = useAuth();

	if (!isLoaded) return null;

	if (isSignedIn) return <Navigate to="/" replace />;

	return (
		<div className="grid place-content-center h-dvh">
			<main>
				<Outlet />
			</main>
		</div>
	);
}
