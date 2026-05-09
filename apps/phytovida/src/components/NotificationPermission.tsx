import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { subscribeToPush } from '@/lib/subscribeToPush';

export default function WaterNotification() {
  const { user, isSignedIn } = useUser();
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === 'granted' && user?.id) {
      await subscribeToPush(user.id);
    }
  };

  if (!isSignedIn) return null;
  if (permission !== 'default') return null;

  return (
    <div className='fixed bottom-5 right-5 p-4 bg-white/50 backdrop-blur-xs border border-border rounded-2xl text-center blur-sm-in transition-transform duration-500 z-50'>
      <p className='flex items-center gap-1'>
        {/* 🌱 */}
        <img
          src='/src/assets/leaf.png'
          className='w-8 h-8'
        />
        Enable watering reminders
      </p>

      <button
        className='text-link cursor-pointer hover:text-link-hover'
        onClick={requestPermission}
      >
        Enable notifications
      </button>
    </div>
  );
}
