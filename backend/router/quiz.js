import { Router } from 'express';
import * as controller from '../controller/quiz.js';
import { checkQuizOwnership, checkRole } from '../middleware/CheckAccess.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.post('/create',verifyToken, checkRole(['admin','teacher']), controller.createQuiz);
router.get('/all', controller.getQuizzes);
router.get('/:id', controller.getQuizById);
router.get('/course/:id', controller.getQuizByCourseId);
router.put('/:id',verifyToken,checkRole(['admin','teacher']), checkQuizOwnership, controller.updateQuiz);
router.delete('/:id',verifyToken, checkRole(['admin', 'teacher']),checkQuizOwnership, controller.deleteQuiz);




export default router;
