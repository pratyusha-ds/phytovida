import type { Request, Response } from 'express';
import { addSubscription } from '../services/push.js';
import { sendResponse } from '../helper/response.js';

// Subscribe
export const subscribeController = async (req: Request, res: Response) => {
  try {
    const { userId, subscription } = req.body;

    if (!userId || !subscription?.endpoint) {
      return sendResponse(res, 400, {
        error: true,
        message: 'Invalid subscription payload',
        success: false,
      });
    }

    await addSubscription(userId, subscription);

    return sendResponse(res, 201, {
      data: {
        userId,
        endpoint: subscription.endpoint,
      },
      message: 'Subscribed',
      success: true,
    });
  } catch (err) {
    console.error('SUBSCRIBE_ERROR:', err);

    return sendResponse(res, 500, {
      error: true,
      message: 'Subscribe failed',
      success: false,
    });
  }
};
