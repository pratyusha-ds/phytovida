import { ClerkProvider } from "@clerk/react";
import { useNavigate } from "react-router";
import AppRoutes from "./routes";

export default function App() {
	const navigate = useNavigate();

	return (
		<ClerkProvider
			appearance={{ cssLayerName: "clerk" }}
			routerPush={(to) => navigate(to)}
			routerReplace={(to) => navigate(to, { replace: true })}
			publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
			<AppRoutes />
		</ClerkProvider>
	);
}
