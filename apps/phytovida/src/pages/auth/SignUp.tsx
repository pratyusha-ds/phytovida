import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <SignUp
      signInUrl="/auth/sign-in"
      forceRedirectUrl="/dashboard"
    />
  );
}