import { db } from '../db/index.js';
import {
  plants,
  pushNotifications,
  pushSubscriptions,
  usersPlants,
} from '../db/schema.js';
import { and, eq, isNull, lt, lte, or, sql } from 'drizzle-orm';
import { sendPush, updateNotificationDate } from '../services/push.js';

export const runCheckReminder = async () => {
  const plantsToWater = await db
    .select({
      plantId: plants.id,
      plantName: plants.name,
      plantImg: plants.imageUrl,
      userId: usersPlants.userId,

      endpoint: pushSubscriptions.endpoint,
      p256dh: pushSubscriptions.p256dh,
      auth: pushSubscriptions.auth,

      nextWaterDate: sql<Date>`
      ${usersPlants.lastWateredDate}
      + (${usersPlants.wateringFrequency} * interval '1 day')
    `,
    })
    .from(usersPlants)
    .leftJoin(plants, eq(usersPlants.plantId, plants.id))
    .leftJoin(
      pushSubscriptions,
      eq(usersPlants.userId, pushSubscriptions.userId),
    )
    .leftJoin(
      pushNotifications,
      and(
        eq(usersPlants.userId, pushNotifications.userId),
        eq(usersPlants.plantId, pushNotifications.plantId),
        eq(pushNotifications.endpoint, pushSubscriptions.endpoint),
        eq(pushNotifications.type, sql`'watering'`),
      ),
    )
    .where(
      and(
        lte(
          sql`${usersPlants.lastWateredDate} + (${usersPlants.wateringFrequency} * interval '1 day')`,
          sql`now()`,
        ),
        or(
          isNull(pushNotifications.lastSentDate),
          lt(pushNotifications.lastSentDate, sql`now() - interval '1 day'`),
        ),
      ),
    );

  for (const plant of plantsToWater) {
    if (!plant.endpoint || !plant.p256dh || !plant.auth) continue;

    const success = await sendPush(
      {
        endpoint: plant.endpoint,
        keys: {
          p256dh: plant.p256dh,
          auth: plant.auth,
        },
      },
      {
        title: plant.plantName ?? 'Plant',
        body: `Time to water your plant`,
        icon: plant.plantImg ?? '/leaf.png',
      },
    );

    if (success) {
      if (!plant.plantId || !plant.userId || !plant.endpoint) continue;
      await updateNotificationDate(plant.plantId, plant.userId, plant.endpoint);
    }
  }
};
