import { ensurePushSubscription } from './subscribeToPush';

export async function registerServiceWorker(userId?: string) {
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    handleSWUpdate(registration, userId);

    return registration;
  } catch (err) {
    console.error('Service Worker registration failed:', err);
    return null;
  }
}

function handleSWUpdate(
  registration: ServiceWorkerRegistration,
  userId?: string,
) {
  registration.onupdatefound = () => {
    const newWorker = registration.installing;

    if (!newWorker) return;

    newWorker.onstatechange = async () => {
      if (newWorker.state === 'installed') {
        if (userId) {
          await ensurePushSubscription(userId);
        }
      }
    };
  };
}
