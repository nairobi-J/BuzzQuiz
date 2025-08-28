'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';


// Test function

interface Question {
  _id: string;
  questionText: string;
  questionType: 'multiple-choice' | 'true/false' | 'short-answer';
  options?: string[];
  correctOption?: number;
  shortAnswer?: string;
  quizID: string;
}

interface Quiz {
  _id: string;
  quizTitle: string;
  duration: number;
  passingScore: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const TakeQuiz = ({ quiz, onFinish }: { quiz: Quiz; onFinish: () => void }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [explanations, setExplanations] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Color scheme
  const colors = {
    primary: 'bg-blue-50 border-blue-200 text-blue-800',
    primaryBorder: 'border-blue-300',
    primaryText: 'text-blue-600',
    primaryLight: 'bg-blue-100',
    success: 'bg-green-50 border-green-200 text-green-800',
    successBorder: 'border-green-300',
    danger: 'bg-red-50 border-red-200 text-red-800',
    dangerBorder: 'border-red-300',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    neutral: 'bg-gray-50 border-gray-200 text-gray-800'
  };

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${BACKEND_URL}/api/question/${quiz._id}`);
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        
        const questionsData = Array.isArray(result) ? result : 
                            result.questions ? result.questions :
                            result.data ? result.data : [];

        if (!questionsData.length) {
          throw new Error('No questions found for this quiz');
        }

        setQuestions(questionsData);
      } catch (err) {
        console.error('Failed to load questions:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [quiz._id]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResults]);

  // Answer handling
  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Navigation
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Auto-submit when time runs out
  const handleAutoSubmit = () => {
    calculateResults();
    setShowResults(true);
  };


const handleSubmit = async () => {
  if (!window.confirm('Are you sure you want to submit your answers?')) return;

  setIsSubmitting(true);
  setShowResults(false); 

  try {
    const {score, results } = calculateResults();
    const timeSpent = quiz.duration * 60 - timeLeft;
    const incorrectQuestions = results.filter(q => !q.isCorrect);
    const newExplanations: Record<string, string> = {};

    const attemptId = await saveQuizAttempt(score, results.filter(q => q.isCorrect).length, timeSpent);

    // Process questions sequentially with error handling
    for (const question of incorrectQuestions) {
      const correctAnswer = question.questionType !== 'short-answer' 
        ? question.options?.[question.correctOption ?? 0] ?? 'Correct answer unavailable'
        : question.shortAnswer ?? 'Correct answer unavailable';
      
      const userAnswer = question.questionType !== 'short-answer'
        ? question.options?.[userAnswers[question._id]] ?? 'No answer provided'
        : userAnswers[question._id] ?? 'No answer provided';

      try {
        const response = await fetch(`${BACKEND_URL}/api/explanation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionText: question.questionText,
            userAnswer,
            correctAnswer
          })
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        newExplanations[question._id] = data.explanation || "No explanation generated";
        
      } catch (error) {
        console.error(`Explanation failed for question ${question._id}:`, error);
        newExplanations[question._id] = "Explanation unavailable - please try again later";
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setExplanations(newExplanations);
    setShowResults(true);

  } catch (error) {
    console.error("Submission failed:", error);
    alert("Failed to submit quiz. Please check your connection.");
  } finally {
    setIsSubmitting(false);
  }
};


const saveQuizAttempt = async (score: number, correctAnswers: number, timeSpent: number) => {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        console.log(token, userId);
        
        if (!token || !userId) {
            throw new Error('Authentication required. Please log in again.');
        }

        // 🟢 FIX: Format answers for backend based on question type
        const formattedAnswers = questions.map(question => {
            const userAnswer = userAnswers[question._id];
            
            // Start with a base answer object
            const baseAnswer = {
                questionId: question._id,
                isCorrect: userAnswers[question._id] === question.correctOption || 
                           (question.questionType === 'short-answer' && 
                            userAnswers[question._id]?.toLowerCase().trim() === question.shortAnswer?.toLowerCase().trim())
            };

            // Conditionally add the correct answer field based on question type
            if (question.questionType === 'multiple-choice' || question.questionType === 'true/false') {
                return {
                    ...baseAnswer,
                    selectedOption: userAnswer
                };
            } else if (question.questionType === 'short-answer') {
                return {
                    ...baseAnswer,
                    selectedAnswerText: userAnswer
                };
            }
            
            return baseAnswer;
        });

        const response = await fetch(`${BACKEND_URL}/api/quiz-history/attempts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({
                userId,
                quizId: quiz._id,
                score,
                totalQuestions: questions.length,
                correctAnswers,
                timeSpent: Math.floor(timeSpent), // timeSpent is already in seconds from your timer
                answers: formattedAnswers
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save quiz attempt');
        }

        const result = await response.json();
        console.log('Quiz attempt saved:', result);
        return result.attempt._id;
    } catch (error) {
        console.error('Error saving quiz attempt:', error);
        throw error;
    }
};




  // Calculate results
  const calculateResults = () => {
    let score = 0;
    const results = questions.map(question => {
      const userAnswer = userAnswers[question._id];
      let isCorrect = false;

      if (question.questionType === 'multiple-choice' || question.questionType === 'true/false') {
        isCorrect = userAnswer === question.correctOption;
      } else if (question.questionType === 'short-answer') {
        isCorrect = userAnswer?.toLowerCase().trim() === question.shortAnswer?.toLowerCase().trim();
      }

      if (isCorrect) score++;

      return {
        ...question,
        userAnswer,
        isCorrect
      };
    });

    return {
      score,
      total: questions.length,
      passed: (score/questions.length)*100 >= quiz.passingScore,
      results,
      percentage: Math.round((score / questions.length) * 100)
    };
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Render current question
  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
      <div className={`w-full max-w-2xl mx-auto p-6  rounded-2xl shadow-2xl`}>
        {/* Question Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            {currentQuestion.questionText}
          </h3>
          <span className={`px-3 py-1 ${colors.primaryLight} rounded-full text-sm font-medium`}>
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Multiple Choice Options */}
        {currentQuestion.questionType === 'multiple-choice' && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <div 
                key={index}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  userAnswers[currentQuestion._id] === index
                    ? `${colors.primaryBorder} border-2 bg-blue-100`
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleAnswerChange(currentQuestion._id, index)}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    userAnswers[currentQuestion._id] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {userAnswers[currentQuestion._id] === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <label className="cursor-pointer flex-1">
                    {option}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* True/False Options */}
        {currentQuestion.questionType === 'true/false' && (
          <div className="grid grid-cols-2 gap-4">
            {['True', 'False'].map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                  userAnswers[currentQuestion._id] === index
                    ? option === 'True'
                      ? 'border-green-300 border-2 bg-green-50'
                      : 'border-red-300 border-2 bg-red-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleAnswerChange(currentQuestion._id, index)}
              >
                <div className="flex items-center justify-center">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                    userAnswers[currentQuestion._id] === index
                      ? option === 'True'
                        ? 'border-green-500 bg-green-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-gray-400'
                  }`}>
                    {userAnswers[currentQuestion._id] === index && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="font-medium">
                    {option}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Short Answer */}
        {currentQuestion.questionType === 'short-answer' && (
          <div className="mt-4">
            <textarea
              value={userAnswers[currentQuestion._id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-violet-400 transition-all"
              rows={4}
            />
            
          </div>
        )}
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    const { score, total, passed, results, percentage } = calculateResults();

    return (
      <div className={`w-full max-w-2xl mx-auto p-8 ${passed ? colors.success : colors.danger} border rounded-xl shadow-sm`}>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
          <div className="flex justify-center mb-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={passed ? "#10b981" : "#ef4444"}
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{percentage}%</span>
                <span className="text-sm">{score}/{total} correct</span>
              </div>
            </div>
          </div>
          <h3 className={`text-xl font-bold mb-1`}>
            {passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪'}
          </h3>
          <p className="">
            {passed ? 'You passed the quiz!' : `You needed ${quiz.passingScore}% correct answers to pass.`}
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Question Review</h3>
          <div className="space-y-4">
            {results.map((question, index) => (
              <div 
                key={question._id} 
                className={`p-4 rounded-lg border ${
                  question.isCorrect 
                    ? colors.successBorder
                    : colors.dangerBorder
                }`}
              >
                <div className="flex items-start mb-2">
                  {question.isCorrect ? (
                    <CheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                  )}
                  <h4 className="font-medium">Question {index + 1}: {question.questionText}</h4>
                </div>
                
                {question.questionType !== 'short-answer' ? (
                  <div className="ml-7">
                    <p>Correct answer: <span className="font-semibold text-green-600">{question.options?.[question.correctOption ?? 0]}</span></p>
                    <p>Your answer: <span className={`font-semibold ${
                      question.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>{question.options?.[userAnswers[question._id]] || 'No answer'}</span></p>
                  </div>
                ) : (
                  <div className="ml-7">
                    <p>Correct answer: <span className="font-semibold text-green-600">{question.shortAnswer}</span></p>
                    <p>Your answer: <span className={`font-semibold ${
                      question.isCorrect ? 'text-green-600' : 'text-red-600'
                    }`}>{userAnswers[question._id] || 'No answer'}</span></p>
                  </div>
                )}
                {!question.isCorrect && (
  <p className="text-sm text-gray-500 mt-1 italic">
    {explanations[question._id] || "No explanation available"}
  </p>
)}
             
                
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={onFinish}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Finish Review
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg text-gray-600">Loading questions...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <div className="bg-white border rounded-xl p-8 max-w-md w-full text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Quiz</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={onFinish}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No questions state
  if (!loading && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <div className="bg-white border rounded-xl p-8 max-w-md w-full text-center shadow-sm">
          <p className="text-lg text-gray-600 mb-6">No questions available for this quiz</p>
          <button 
            onClick={onFinish}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Main quiz render
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {!showResults ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">{quiz.quizTitle}</h2>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <Clock className="text-blue-500 mr-2" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
                
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  <span className="font-medium">
                    {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>
              </div>
            </div>

            {renderQuestion()}

            <div className="flex justify-between mt-8">
              <button 
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-5 py-2 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-200'
                }`}
              >
                <ChevronLeft className="mr-2" />
                Previous
              </button>
              
              {currentQuestionIndex < questions.length - 1 ? (
                <button 
                  onClick={handleNext}
                  className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Next
                  <ChevronRight className="ml-2" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center px-5 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      Submit Quiz
                      <Send className="ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;

function getGenerativeModel(arg0: { model: string; }) {
  throw new Error('Function not implemented.');
}
