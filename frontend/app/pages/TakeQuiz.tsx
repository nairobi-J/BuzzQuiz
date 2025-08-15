'use client';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

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
  // State management
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60);

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
        
        // Handle different response formats
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

  // Manual submit
  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit your answers?')) {
      calculateResults();
      setShowResults(true);
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
      passed: score >= quiz.passingScore,
      results
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
      <div className="question-container">
        <h3>{currentQuestion.questionText}</h3>
        
        {currentQuestion.questionType === 'multiple-choice' && (
          <div className="options">
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="option">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="quiz-option"
                  checked={userAnswers[currentQuestion._id] === index}
                  onChange={() => handleAnswerChange(currentQuestion._id, index)}
                />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.questionType === 'true/false' && (
          <div className="options">
            {['True', 'False'].map((option, index) => (
              <div key={index} className="option">
                <input
                  type="radio"
                  id={`tf-${index}`}
                  name="quiz-tf"
                  checked={userAnswers[currentQuestion._id] === index}
                  onChange={() => handleAnswerChange(currentQuestion._id, index)}
                />
                <label htmlFor={`tf-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        )}

        {currentQuestion.questionType === 'short-answer' && (
          <textarea
            value={userAnswers[currentQuestion._id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
            placeholder="Type your answer..."
          />
        )}
      </div>
    );
  };

  // Render results
  const renderResults = () => {
    const { score, total, passed, results } = calculateResults();

    return (
      <div className="results-container">
        <h2>Quiz Results</h2>
        <div className={`score ${passed ? 'passed' : 'failed'}`}>
          {score}/{total} - {passed ? 'Passed!' : 'Failed'}
        </div>

        <div className="questions-review">
          {results.map((question, index) => (
            <div key={question._id} className={`question-result ${question.isCorrect ? 'correct' : 'incorrect'}`}>
              <h4>Question {index + 1}: {question.questionText}</h4>
              
              {question.questionType !== 'short-answer' ? (
                <>
                  <p>Correct answer: {question.options?.[question.correctOption ?? 0]}</p>
                  <p>Your answer: {question.options?.[userAnswers[question._id]] || 'No answer'}</p>
                </>
              ) : (
                <>
                  <p>Correct answer: {question.shortAnswer}</p>
                  <p>Your answer: {userAnswers[question._id] || 'No answer'}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <button onClick={onFinish} className="finish-btn">
          Finish Review
        </button>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <AlertCircle className="error-icon" />
        <h3>Error Loading Quiz</h3>
        <p>{error}</p>
        <button onClick={onFinish}>Go Back</button>
      </div>
    );
  }

  // No questions state
  if (!loading && questions.length === 0) {
    return (
      <div className="empty-state">
        <p>No questions available for this quiz</p>
        <button onClick={onFinish}>Go Back</button>
      </div>
    );
  }

  // Main quiz render
  return (
    <div className="quiz-container">
      {!showResults ? (
        <>
          <div className="quiz-header ">
            <h2>{quiz.quizTitle}</h2>
            <div className="timer">
              <Clock /> {formatTime(timeLeft)}
            </div>
            <div className="progress">
              Question {currentQuestionIndex + 1}/{questions.length}
            </div>
          </div>

          {renderQuestion()}

          <div className="navigation-buttons">
            <button 
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            
            {currentQuestionIndex < questions.length - 1 ? (
              <button onClick={handleNext}>
                Next
              </button>
            ) : (
              <button onClick={handleSubmit}>
                Submit Quiz
              </button>
            )}
          </div>
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
};

export default TakeQuiz;