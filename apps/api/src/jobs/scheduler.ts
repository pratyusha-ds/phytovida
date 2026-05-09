import cron from 'node-cron';
import { runCheckReminder } from './checkReminder.js';

let isRunning = false;
let taskStarted = false;

export function startScheduler() {
  if (taskStarted) {
    console.log('Scheduler already started');
    return;
  }

  taskStarted = true;

  cron.schedule('0 * * * *', async () => {
    if (isRunning) return;

    isRunning = true;
    try {
      await runCheckReminder();
    } catch (err) {
      console.error('Scheduler error:', err);
    } finally {
      isRunning = false;
    }
  });
}
