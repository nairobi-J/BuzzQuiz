// controllers/aiRecommendations.js
import { QuizAttempt } from '../models/quizAttempts.js';
import { Quiz } from '../models/quiz.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get AI recommendations based on user performance
export const getAIRecommendations = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user's quiz attempts
    const attempts = await QuizAttempt.find({ userId })
      .populate({
        path: 'quizId',
        select: 'quizTitle courseID passingScore',
        populate: {
          path: 'courseID',
          select: 'courseName'
        }
      });
    
    // Filter out any attempts where the quiz data failed to populate
    const validAttempts = attempts.filter(attempt => attempt.quizId);

    if (validAttempts.length === 0) {
      return res.json({ 
        recommendations: [{
          type: "general",
          message: "Complete some quizzes to get personalized recommendations!",
          suggestion: "Start with beginner-level quizzes to build your foundation."
        }]
      });
    }
    
    // Prepare data for AI analysis
    const performanceData = validAttempts.map(attempt => ({
      quiz: attempt.quizId.quizTitle,
      course: attempt.quizId.courseID.courseName,
      score: attempt.score,
      passingScore: attempt.quizId.passingScore,
      date: attempt.completedAt.toISOString().split('T')[0],
      timeSpent: attempt.timeSpent
    }));
    
    // Identify weak areas
    const weakAreas = [];
    const coursePerformance = {};
    
    validAttempts.forEach(attempt => {
      const courseName = attempt.quizId.courseID.courseName;
      
      if (!coursePerformance[courseName]) {
        coursePerformance[courseName] = {
          totalScore: 0,
          count: 0
        };
      }
      
      coursePerformance[courseName].totalScore += attempt.score;
      coursePerformance[courseName].count += 1;
    });
    
    for (const [course, data] of Object.entries(coursePerformance)) {
      const averageScore = data.totalScore / data.count;
      if (averageScore < 70) {
        weakAreas.push(course);
      }
    }
    
    // Generate prompt for Gemini AI
    const prompt = `
      Analyze this student's quiz performance and provide personalized recommendations:
      
      Performance Data: ${JSON.stringify(performanceData, null, 2)}
      
      Weak Areas: ${weakAreas.join(', ')}
      
      Please provide 3-5 specific recommendations that could include:
      1. Books or learning resources based on their weak areas
      2. Study strategies tailored to their performance patterns
      3. Suggestions for which topics to focus on
      4. Practice recommendations
      5. Time management suggestions based on their time spent
      
      Format the response as a JSON array with objects that have:
      - type: either "book", "practice", "focus", "resource", or "general"
      - message: a detailed recommendation message
      - title: if it's a book recommendation, the book title
      - author: if it's a book recommendation, the author
      - link: if it's a resource, a relevant link (can be empty)
      - course: if it's specific to a course
      
      Make the recommendations practical and actionable.
    `;
    
    try {
      // Get recommendations from Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response (this might need more robust parsing)
      let recommendations;
      try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recommendations = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback to default recommendations if parsing fails
          recommendations = getFallbackRecommendations(weakAreas);
        }
      } catch (error) {
        console.error("Error parsing AI recommendations:", error);
        recommendations = getFallbackRecommendations(weakAreas);
      }
      
      res.json({ recommendations });
    } catch (aiError) {
      console.error("Gemini API error:", aiError);
      // Fallback to non-AI recommendations
      const recommendations = getFallbackRecommendations(weakAreas);
      res.json({ recommendations });
    }
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

// Fallback recommendations if AI fails
function getFallbackRecommendations(weakAreas) {
  const recommendations = [
    {
      type: "general",
      message: "Based on your performance, try to focus more on practicing quizzes regularly."
    }
  ];
  
  if (weakAreas.length > 0) {
    recommendations.push({
      type: "focus",
      message: `You seem to be struggling with ${weakAreas.join(' and ')}. Consider spending more time on these subjects.`,
      course: weakAreas[0]
    });
    
    recommendations.push({
      type: "practice",
      message: "Try to attempt quizzes on your weaker areas multiple times to improve understanding."
    });
  }
  
  return recommendations;
}