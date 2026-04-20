import { ClerkProvider } from '@clerk/react';
import { useNavigate } from 'react-router';
import AppRoutes from './routes';

export default function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      appearance={{
        cssLayerName: 'clerk',
        elements: {
          rootBox:
            'rounded-[52px] border border-border shadow-2xl overflow-hidden',
          headerTitle: 'font-serif text-2xl',
          headerSubtitle: 'text-paragraph',
          formFieldLabel: 'text-captions',
          dividerLine: 'bg-divider',
          formFieldInput:
            'rounded-[12px] p-5 border border-secondary shadow-none focus:border-primary focus:ring-0',
          formButtonPrimary:
            'rounded-[12px] px-6 py-3 bg-secondary text-headline border-secondary border-none shadow-none',
          socialButtonsBlockButton:
            'px-6 py-3 rounded-[12px] bg-accent3 text-accent ',
          footerActionLink: 'text-link hover:text-link-hover',
          formFieldErrorText: 'text-error',
        },
      }}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    >
      <AppRoutes />
    </ClerkProvider>
  );
}
