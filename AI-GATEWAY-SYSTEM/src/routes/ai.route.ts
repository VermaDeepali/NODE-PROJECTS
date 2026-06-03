import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';

const router = Router();
const controller = new AIController();

router.post('/ask', controller.ask);

export default router;