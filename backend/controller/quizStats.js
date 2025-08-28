// controllers/quizStats.js
import { QuizAttempt } from '../models/quizAttempts.js';
import { Quiz } from '../models/quiz.js';

// Get user's quiz statistics
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get all attempts with populated quiz data
    const attempts = await QuizAttempt.find({ userId })
      .populate({
        path: 'quizId',
        select: 'quizTitle courseID passingScore',
        populate: {
          path: 'courseID',
          select: 'courseName'
        }
      });
    
    // Filter out attempts where quizId population failed
    const validAttempts = attempts.filter(attempt => attempt.quizId);

    if (validAttempts.length === 0) {
      return res.json({
        totalAttempts: 0,
        averageScore: 0,
        totalQuizzes: 0,
        passedQuizzes: 0,
        totalPracticeDays: 0,
        coursePerformance: [],
        dailyActivity: []
      });
    }

    // Calculate basic stats
    const totalAttempts = validAttempts.length;
    const averageScore = validAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts;
    
    // Count unique quizzes and passed quizzes
    const quizSet = new Set();
    const passedQuizzes = validAttempts.filter(attempt => attempt.score >= attempt.quizId.passingScore).length;
    
    validAttempts.forEach(attempt => {
      quizSet.add(attempt.quizId._id.toString());
    });
    
    const totalQuizzes = quizSet.size;
    
    // Calculate practice days
    const attemptDates = validAttempts.map(attempt => 
      new Date(attempt.completedAt).toLocaleDateString()
    );
    const totalPracticeDays = new Set(attemptDates).size;
    
    // Calculate course performance
    const coursePerformanceMap = new Map();
    
    validAttempts.forEach(attempt => {
      const courseId = attempt.quizId.courseID._id.toString();
      const courseName = attempt.quizId.courseID.courseName;
      
      if (!coursePerformanceMap.has(courseId)) {
        coursePerformanceMap.set(courseId, {
          courseId,
          courseName,
          attempts: 0,
          totalScore: 0,
          passedAttempts: 0
        });
      }
      
      const courseData = coursePerformanceMap.get(courseId);
      courseData.attempts += 1;
      courseData.totalScore += attempt.score;
      if (attempt.score >= attempt.quizId.passingScore) {
        courseData.passedAttempts += 1;
      }
    });
    
    const coursePerformance = Array.from(coursePerformanceMap.values()).map(course => ({
      courseId: course.courseId,
      courseName: course.courseName,
      attempts: course.attempts,
      averageScore: course.totalScore / course.attempts,
      passRate: (course.passedAttempts / course.attempts) * 100
    }));
    
    // Calculate daily activity (last 30 days)
    const dailyActivity = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayAttempts = validAttempts.filter(attempt => {
        const attemptDate = new Date(attempt.completedAt).toISOString().split('T')[0];
        return attemptDate === dateString;
      });
      
      dailyActivity.push({
        date: dateString,
        attempts: dayAttempts.length
      });
    }
    
    res.json({
      totalAttempts,
      averageScore,
      totalQuizzes,
      passedQuizzes,
      totalPracticeDays,
      coursePerformance,
      dailyActivity
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};