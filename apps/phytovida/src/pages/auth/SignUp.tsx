import { SignUp } from '@clerk/react';
import { useLocation } from 'react-router';

export default function SignInPage() {
  const { state } = useLocation();

  return <SignUp fallbackRedirectUrl={state?.from || '/'} />;
}
