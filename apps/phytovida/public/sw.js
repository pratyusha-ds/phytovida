self.addEventListener('push', (event) => {
  console.log('🔥 PUSH RECEIVED');

  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/leaf.png',
    }),
  );
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
