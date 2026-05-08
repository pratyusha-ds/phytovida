import webpush from '../config/webpush.js';
import { db } from '../db/index.js';
import { pushNotifications, pushSubscriptions } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

type PushPayload = {
  title: string;
  body: string;
  icon?: string;
};

export const addSubscription = async (userId: string, sub: any) => {
  await db
    .insert(pushSubscriptions)
    .values({
      userId,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: {
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    });
};

export const sendPush = async (
  sub: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  },
  payload: PushPayload,
) => {
  try {
    await webpush.sendNotification(sub, JSON.stringify(payload));
    console.log('✅ sent to', sub.endpoint);
    return true;
  } catch (err: any) {
    console.error('PUSH ERROR', err);

    if (err.statusCode === 404 || err.statusCode === 410) {
      await db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, sub.endpoint));
    }
    return false;
  }
};

export const updateNotificationDate = async (
  plantId: string,
  userId: string,
  endpoint: string,
) => {
  await db
    .insert(pushNotifications)
    .values({
      plantId,
      userId,
      endpoint,
      type: 'watering',
      lastSentDate: sql`CURRENT_DATE`,
    })
    .onConflictDoUpdate({
      target: [
        pushNotifications.plantId,
        pushNotifications.userId,
        pushNotifications.endpoint,
        pushNotifications.type,
      ],
      set: {
        lastSentDate: sql`CURRENT_DATE`,
      },
    });
};
