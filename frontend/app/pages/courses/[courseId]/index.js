import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '../../../components/Layout';
import QuizCard from '../../../components/QuizCard';
import CreateQuizModal from '../../../components/CreateQuizModal';

export default function QuizDashboard() {
  const router = useRouter();
  const { courseId } = router.query;
  const [quizzes, setQuizzes] = useState([]);
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, courseRes, userRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/quiz/course/${courseId}`),
          axios.get(`http://localhost:8000/api/course/${courseId}`),
          axios.get('http://localhost:8000/api/auth/me', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);
        setQuizzes(quizzesRes.data);
        setCourse(courseRes.data);
        setUser(userRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (courseId) fetchData();
  }, [courseId]);

  const handleCreateQuiz = async (quizData) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/quiz/create',
        {
          ...quizData,
          courseID: courseId,
          teacherID: user._id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setQuizzes([...quizzes, response.data]);
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating quiz');
    }
  };

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {course?.courseName || 'Loading...'} Quizzes
            </h1>
            <p className="text-gray-600 mt-2">
              {quizzes.length} quizzes available
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search quizzes..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {(user?.role === 'admin' || user?.role === 'teacher') && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg whitespace-nowrap"
              >
                Create Quiz
              </button>
            )}
          </div>
        </div>
        
        {filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600">
              {searchTerm ? 'No matching quizzes found' : 'No quizzes available yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map(quiz => (
              <QuizCard 
                key={quiz._id}
                quiz={quiz}
                onTakeQuiz={() => router.push(`/quiz/${quiz._id}/take`)}
              />
            ))}
          </div>
        )}
        
        <CreateQuizModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateQuiz}
        />
      </div>
    </Layout>
  );
}