import { Question } from '../models/question.js';
import { Quiz } from '../models/quiz.js';

// Create Question
export const createQuestion = async (req, res) => {
    try {
        const { questionText, questionType, quizID, options, shortAnswer } = req.body;
        
        // Find the quiz to ensure it exists
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        const newQuestion = {
            questionText,
            questionType,
            quizID,
        };

        if (questionType === 'multiple-choice' || questionType === 'true/false') {
            newQuestion.options = options;
        } else if (questionType === 'short answer') {
            newQuestion.shortAnswer = shortAnswer;
        }

        const question = await Question.create(newQuestion);

        // Add the new question's ID to the quiz's questions array
        quiz.questions.push(question._id);
        await quiz.save();

        res.status(201).json({
            message: 'Question created successfully',
            question
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Get Questions by Quiz ID
export const getQuestionsByQuizId = async (req, res) => {
    try {
        const quizId = req.params.id;
        const questions = await Question.find({ quizID: quizId }).populate('options').populate('shortAnswer');
        res.json(questions);
    } catch (error) {
        console.error('Error getting questions by quiz ID:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Update Question
export const updateQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const updates = req.body;
        const updatedQuestion = await Question.findByIdAndUpdate(questionId, updates, { new: true, runValidators: true });

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question updated successfully', question: updatedQuestion });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Delete Question
export const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;
        const deletedQuestion = await Question.findByIdAndDelete(questionId);

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        // Remove the question's ID from the corresponding quiz's questions array
        await Quiz.findByIdAndUpdate(deletedQuestion.quizID, {
            $pull: { questions: deletedQuestion._id }
        });

        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Get All Questions
export const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (error) {
        console.error('Error getting all questions:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};