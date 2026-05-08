import { Router } from 'express';
import { subscribeController } from '../controllers/push.js';

const router: Router = Router();

router.post('/subscribe', subscribeController);

export default router;
