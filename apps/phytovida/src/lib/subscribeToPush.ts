function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64Fixed = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

  const raw = atob(base64Fixed);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function createPushSubscription(reg: ServiceWorkerRegistration) {
  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      import.meta.env.VITE_VAPID_PUBLIC_KEY,
    ),
  });
}

async function sendSubscriptionToServer(sub: PushSubscription, userId: string) {
  try {
    return await fetch(`${import.meta.env.VITE_API_URL}/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscription: sub }),
    });
  } catch (err) {
    console.error('Network error while sending subscription:', err);
    throw err;
  }
}

export async function subscribeToPush(userId: string) {
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();

  // Create subscription
  if (!sub) sub = await createPushSubscription(reg);

  // Send to server
  let res = await sendSubscriptionToServer(sub, userId);

  // Re-create if server rejected
  if (!res.ok) {
    console.warn('Server rejected subscription, re-subscribing...');
    await sub.unsubscribe();

    const newSub = await createPushSubscription(reg);
    res = await sendSubscriptionToServer(newSub, userId);
  }

  console.log('✅ subscribed');
}

export async function ensurePushSubscription(userId: string) {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();

  if (!sub) {
    await subscribeToPush(userId);
    return;
  }
}
