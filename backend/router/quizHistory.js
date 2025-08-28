// routes/quizHistory.js
import { Router } from 'express';
import * as controller from '../controller/quizHistory.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.post('/attempts', verifyToken, controller.saveQuizAttempt);
router.get('/attempts', verifyToken, controller.getQuizAttempts);
router.get('/attempts/:id', verifyToken, controller.getQuizAttempt);

export default router;