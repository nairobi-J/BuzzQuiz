// middleware/checkCourseOwnership.js
import { Course } from '../models/course.js';
import { Quiz } from '../models/quiz.js';

// This is the generalized middleware for role-based access control
const checkRole = (allowedRoles) => (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied. You do not have the required permissions.' });
    }
};

const checkCourseOwnership = async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const userId = req.user.userId;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found.' });
        }

        if (course.adminID.toString() === userId) {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. You can only modify your own courses.' });
        }
    } catch (error) {
        console.error('Error in ownership check:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const checkQuizOwnership = async (req, res, next) => {
    try {
        const quizId = req.params.id;
        const userId = req.user.userId;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'quizzzzz not found.' });
        }


        if (quiz.creatorID._id.toString() === userId) {
            next();
        } else {
            console.log('Comparing:', {
              creatorId: quiz.creatorID._id.toString(),
             userId: userId
});
            return res.status(403).json({ message: 'Access denied.!! You can only modify your own quiz.' });
        }
    } catch (error) {
        console.error('Error in ownership check:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export { checkRole, checkCourseOwnership,checkQuizOwnership };
