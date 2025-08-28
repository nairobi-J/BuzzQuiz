// controllers/quizHistory.js
import { QuizAttempt } from '../models/quizAttempts.js';
import { Quiz } from '../models/quiz.js';
// controllers/quizHistory.js - Add this function


export const saveQuizAttempt = async (req, res) => {
    try {
        // Mongoose will automatically validate and assign
        // the correct fields (selectedOption or selectedAnswerText)
        // based on the data sent from the frontend.
       const userId = req.user.userId; // ⬅️ Get userId from the token
        const { quizId, score, totalQuestions, correctAnswers, answers, timeSpent } = req.body;

        const attempt = new QuizAttempt({
            userId, // ⬅️ Use the userId from the token
            quizId,
            score,
            totalQuestions,
            correctAnswers,
            answers,
            timeSpent
        });
        const savedAttempt = await attempt.save();

        // Populate the quiz data for the response
        await savedAttempt.populate({
            path: 'quizId',
            select: 'quizTitle courseID',
            populate: {
                path: 'courseID',
                select: 'courseName'
            }
        });

        res.status(201).json({
            message: 'Quiz attempt saved successfully',
            attempt: savedAttempt
        });
    } catch (error) {
        console.error('Error saving quiz attempt:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// ... the rest of your controller code (getQuizAttempts, getQuizAttempt) is fine as is.
// Get user's quiz attempts
export const getQuizAttempts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10, courseId } = req.query;
    
    const filter = { userId };
    if (courseId) {
      // Find quizzes in the course first
      const quizzes = await Quiz.find({ courseID: courseId }).select('_id');
      const quizIds = quizzes.map(quiz => quiz._id);
      filter.quizId = { $in: quizIds };
    }
    
    const attempts = await QuizAttempt.find(filter)
      .populate({
        path: 'quizId',
        select: 'quizTitle courseID',
        populate: {
          path: 'courseID',
          select: 'courseName'
        }
      })
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await QuizAttempt.countDocuments(filter);
    
    res.json({
      userId,
      attempts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

// Get specific quiz attempt
export const getQuizAttempt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
    const attempt = await QuizAttempt.findById(id)
      .populate({
        path: 'quizId',
        select: 'quizTitle courseID passingScore',
        populate: {
          path: 'courseID',
          select: 'courseName'
        }
      })
      .populate({
        path: 'answers.questionId',
        select: 'questionText options'
      });
    
    if (!attempt) {
      return res.status(404).json({ message: 'Quiz attempt not found' });
    }
    
    // Check if the attempt belongs to the user
    if (attempt.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(attempt);
  } catch (error) {
    console.error('Error fetching quiz attempt:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};