import { Quiz } from '../models/quiz.js';
import { Course } from '../models/course.js';



// Create Quiz (Admin or Teacher)
export const createQuiz = async (req, res) => {
    try {
        const { quizTitle, description, duration, courseID, numQuestions, passingScore } = req.body;

        // Get creatorID from authenticated user (comes from verifyToken middleware)
        if (!req.user?.userId) {
            return res.status(400).json({ message: 'User authentication failed' });
        }

        const quiz = new Quiz({
            quizTitle,
            description: description || '',
            duration: Number(duration),
            courseID,
            numQuestions: Number(numQuestions) || 1,
            passingScore: Number(passingScore) || 70,
            creatorID: req.user.userId // Use userId from middleware
        });

        const savedQuiz = await quiz.save();
        
        // Update course with new quiz
        await Course.findByIdAndUpdate(courseID, {
            $push: { quizzes: savedQuiz._id }
        });

        res.status(201).json({
            message: 'Quiz created successfully',
            quiz: savedQuiz
        });

    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Get all quizzes (Admin only)
export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find()
            .populate('creatorID', 'name email')
            .populate('courseID', 'courseName');

        res.json(quizzes);
    } catch (error) {
        console.error('Error getting quizzes:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
};


export const getQuizById = async (req, res) => {
    try {
        //const { role, _id: userId } = req.user;
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId)
            .populate('creatorID', 'name email')
            .populate('courseID', 'courseName');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
       return res.json(quiz);

    } catch (error) {
        console.error('Error getting quiz:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
};

// Get quizzes by course ID (Admin or Teacher of the course)
export const getQuizByCourseId = async (req, res) => {
    try {
        //const { role, _id: userId } = req.user;
        const courseId = req.params.id;
       const quizzes = await Quiz.find({ courseID: courseId })
            .populate('creatorID', 'name email')
            .sort({ startTime: 1 });

        res.json(quizzes);
    } catch (error) {
        console.error('Error getting quizzes by course:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
};

// Update Quiz (Admin or Teacher of the course)
export const updateQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const updates = req.body;

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json({
            message: 'Quiz updated successfully',
            quiz: updatedQuiz
        });
    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
};

// Delete Quiz (Admin or Teacher of the course)
export const deleteQuiz = async (req, res) => {
    try {
        //const { role, _id: userId } = req.user;
        const quizId = req.params.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        
        await Quiz.findByIdAndDelete(quizId);

        // Remove quiz reference from course
        await Course.findByIdAndUpdate(quiz.courseID, {
            $pull: { quizzes: quizId }
        });

        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ 
            message: 'Internal Server Error',
            error: error.message 
        });
    }
};

