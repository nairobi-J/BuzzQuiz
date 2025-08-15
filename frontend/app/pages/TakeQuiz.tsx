'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Radio, Square, Text, Loader2 } from 'lucide-react';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const TakeQuiz = ({ quiz, onFinish }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/question/${quiz._id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions.');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [quiz._id]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit your answers?')) {
      setIsSubmitting(true);
      // Simulate API call to submit answers
      setTimeout(() => {
        setIsSubmitting(false);
        onFinish();
        alert('Quiz submitted successfully!');
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-10">
        <h4 className="text-2xl font-bold mb-4">No Questions Found</h4>
        <p className="text-gray-600">This quiz does not have any questions yet. Please try again later.</p>
        <button onClick={onFinish} className="mt-6 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h3 className="text-2xl font-bold">{quiz.quizTitle}</h3>
        <span className="text-lg font-medium text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="mb-8">
        <p className="text-lg mb-4">{currentQuestion.questionText}</p>

        {currentQuestion.questionType === 'multiple-choice' && (
          <div className="space-y-4">
            {currentQuestion.options.map(option => (
              <label key={option._id} className="flex items-center p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name={`question-${currentQuestion._id}`}
                  value={option._id}
                  checked={userAnswers[currentQuestion._id] === option._id}
                  onChange={() => handleAnswerChange(currentQuestion._id, option._id)}
                  className="mr-3 h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-gray-700">{option.optionText}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.questionType === 'short answer' && (
          <textarea
            value={userAnswers[currentQuestion._id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
            className="w-full h-32 p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
            placeholder="Type your answer here..."
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-full disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;