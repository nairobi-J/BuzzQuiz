// routes/quizStats.js
import { Router } from 'express';
import * as controller from '../controller/quizStats.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.get('/stats', verifyToken, controller.getUserStats);

export default router;