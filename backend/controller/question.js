import { Question } from '../models/question.js';
import { Quiz } from '../models/quiz.js';
import mongoose from 'mongoose';
// Create Question
export const createQuestion = async (req, res) => {
    try {
        const { questionText, questionType, quizID, options, correctOption, shortAnswer } = req.body;
        
        // Validate required fields
        if (!questionText || !questionType || !quizID) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['questionText', 'questionType', 'quizID']
            });
        }

        // Validate quiz exists
        const quiz = await Quiz.findById(quizID);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        // Initialize question object
        const newQuestion = {
            questionText,
            questionType,
            quizID,
        };

        // Handle different question types
        switch (questionType) {
            case 'multiple-choice':
                if (!options || !Array.isArray(options)) {
                    return res.status(400).json({ 
                        message: 'Options array required for multiple-choice questions'
                    });
                }
                if (correctOption === undefined || correctOption === null) {
                    return res.status(400).json({ 
                        message: 'correctOption index required for multiple-choice questions'
                    });
                }
                newQuestion.options = options.filter(opt => opt.trim() !== '');
                newQuestion.correctOption = correctOption;
                break;
                
            case 'true/false':
                newQuestion.options = ['True', 'False'];
                newQuestion.correctOption = correctOption ?? 0;
                break;
                
            case 'short-answer':
                if (!shortAnswer || shortAnswer.trim() === '') {
                    return res.status(400).json({ 
                        message: 'shortAnswer text required for short-answer questions'
                    });
                }
                newQuestion.shortAnswer = shortAnswer.trim();
                break;
                
            default:
                return res.status(400).json({ 
                    message: 'Invalid question type',
                    validTypes: ['multiple-choice', 'true/false', 'short-answer']
                });
        }

        const question = await Question.create(newQuestion);

        // Update quiz with new question
        quiz.questions.push(question._id);
        await quiz.save();

        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            question
        });
        
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create question',
            error: error.message
        });
    }
};

// Get Questions by Quiz ID
export const getQuestionsByQuizId = async (req, res) => {
    try {
        const quizId = req.params.id;
        
        // Validate quiz ID format
        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid quiz ID format'
            });
        }

        const questions = await Question.find({ quizID: quizId });
        
        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No questions found for this quiz'
            });
        }

        res.json({
            success: true,
            count: questions.length,
            questions
        });
        
    } catch (error) {
        console.error('Error getting questions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions',
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