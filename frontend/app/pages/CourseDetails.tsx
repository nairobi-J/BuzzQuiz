/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, User, Plus } from 'lucide-react';
import Alert from '../components/Alert';
import CreateQuizModal from '../components/CreateQuizModal';

import AddQuestionModal from '../components/AddQuestionModal';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CourseDetails = ({setAlertMessage, setAlertType, setShowAlert, course, onBack, onQuizClick }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Course not found.
      </div>
    );
  }

 const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/quiz/course/${course._id}`);
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      setQuizzes(await response.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [course._id]);

  const handleQuestionAdded = (newQuestion) => {
    console.log('New question added:', newQuestion);
    // In a real app, you might want to refetch the quizzes or
    // update the state to show the new question
  };

  const handleTakeQuizClick = (quiz) => {
    // A more robust confirmation can replace this alert.
    if (window.confirm(`Are you sure you want to start the quiz "${quiz.quizTitle}"? You will have ${quiz.duration} minutes.`)) {
      onQuizClick(quiz);
    }
  };
 const onQuizCreated = () => {
    fetchQuizzes(); // This will now work
    // setAlertMessage('Quiz created successfully!');
    // setAlertType('success');
    // setShowAlert(true);
  };
  return (
    <div>
      <div className="mb-6 flex items-center space-x-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h3 className="text-3xl font-extrabold text-gray-900">{course.courseName}</h3>
      </div>
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200 mb-6">
        <p className="text-gray-600 mb-4">{course.details}</p>
        <p className="text-gray-500 text-sm">
          **Created By:** {course.creatorName}
        </p>
        <p className="text-gray-500 text-sm">
          **Created on:** {new Date(course.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center justify-between mb-4">
  <h4 className="text-2xl font-bold">Quizzes and Exams</h4>
  <button 
    onClick={() => setIsCreateQuizModalOpen(true)}
    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
  >
    <Plus size={18} /> Create Quiz
  </button>
</div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
         
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map(quiz => (
              <div key={quiz._id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div className="flex items-center space-x-4 mb-4">
                  <BookOpen className="w-8 h-8 text-green-500" />
                  <h4 className="text-xl font-semibold">{quiz.quizTitle}</h4>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {quiz.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.duration} mins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{quiz.creatorID.email}</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                 
                  <button
                    onClick={() => handleTakeQuizClick(quiz)}
                    className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                  >
                    Take Exam
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No quizzes found for this course.</p>
        )}
      </div>
      
      <AddQuestionModal
          isOpen={isAddQuestionModalOpen}
          onClose={() => setIsAddQuestionModalOpen(false)}
          quizID={selectedQuiz ? selectedQuiz._id : null}
          onQuestionAdded={handleQuestionAdded}
      />
      <CreateQuizModal
        isOpen={isCreateQuizModalOpen}
        onClose={() => setIsCreateQuizModalOpen(false)}
        courseID={course._id}
        onQuizCreated={onQuizCreated}
      />
    </div>
  );
};

export default CourseDetails;