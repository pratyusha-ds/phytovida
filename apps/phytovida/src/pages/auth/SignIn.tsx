import { SignIn } from "@clerk/react";
import { useLocation } from "react-router";

export default function SignInPage() {
	const { state } = useLocation();

	return (
		<SignIn
			appearance={{
				elements: {
					formButtonPrimary: "bg-primary",
				},
			}}
			fallbackRedirectUrl={state?.from || "/"}
		/>
	);
}
