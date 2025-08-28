// routes/aiRecommendations.js
import { Router } from 'express';
import * as controller from '../controller/aiRecommendation.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.get('/recommendations', verifyToken, controller.getAIRecommendations);

export default router;