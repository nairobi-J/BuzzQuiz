import { Router } from 'express';
import * as controller from '../controller/question.js';
import { checkQuizOwnership, checkRole } from '../middleware/CheckAccess.js'; // Assuming you have these
import validateQuestion from '../middleware/validateQuestion.js';
import verifyToken from '../middleware/verifyToken.js'; // Assuming you have this

const router = Router();

// Create a new question
router.post('/create',verifyToken, checkRole(['admin','teacher']),validateQuestion,  controller.createQuestion);

// Get questions by quiz ID
router.get('/:id', controller.getQuestionsByQuizId);

// Update a question
router.put('/:id', verifyToken, checkRole(['admin', 'teacher']), checkQuizOwnership, controller.updateQuestion);

// Delete a question
router.delete('/:id', verifyToken, checkRole(['admin', 'teacher']), checkQuizOwnership, controller.deleteQuestion);

// Get All Questions (for development/admin purposes)
router.get('/all', controller.getAllQuestions);

export default router;