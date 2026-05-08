import { Outlet } from 'react-router';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import NotificationPermission from '@/components/NotificationPermission';
import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { registerServiceWorker } from '@/lib/registerServiceWorker';

export default function CommonLayout() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    registerServiceWorker(user.id);
  }, [isLoaded, user?.id]);

  return (
    <div className='max-w-7xl mx-auto  '>
      <NotificationPermission />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
