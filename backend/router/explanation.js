import { Router } from 'express';
import { generateQuizExplanation } from '../controller/explanation.js'; // Named import


const router = Router();

// For named export:
router.post('/', generateQuizExplanation);



export default router;