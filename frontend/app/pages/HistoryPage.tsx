import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { Calendar, TrendingUp, BookOpen, Award, Clock, Target, Brain, Bookmark } from 'lucide-react';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// Types
interface QuizAttempt {
  _id: string;
  quizId: {
    _id: string;
    quizTitle: string;
    courseID: {
      _id: string;
      courseName: string;
    };
    passingScore: number;
  };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  timeSpent: number;
}

interface UserStats {
  totalAttempts: number;
  averageScore: number;
  totalQuizzes: number;
  passedQuizzes: number;
  totalPracticeDays: number;
  coursePerformance: {
    courseId: string;
    courseName: string;
    attempts: number;
    averageScore: number;
    passRate: number;
  }[];
  dailyActivity: {
    date: string;
    attempts: number;
  }[];
}

interface AIRecommendation {
  type: 'book' | 'practice' | 'focus' | 'resource' | 'general';
  message: string;
  title?: string;
  author?: string;
  link?: string;
  course?: string;
}

const QuizHistory: React.FC = () => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchUserHistory();
    fetchUserStats();
    fetchAIRecommendations();
  }, []);

  const fetchUserHistory = async (page = 1, courseId = 'all') => {
    try {
      let url = `${BACKEND_URL}/api/quiz-history/attempts?page=${page}&limit=10`;
      if (courseId !== 'all') {
        url += `&courseId=${courseId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAttempts(data.attempts);
      setPagination({
        page: data.currentPage,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/quiz-stats/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchAIRecommendations = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/ai/recommendations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseFilterChange = (courseId: string) => {
    setSelectedCourse(courseId);
    fetchUserHistory(1, courseId);
  };

  const handlePageChange = (newPage: number) => {
    fetchUserHistory(newPage, selectedCourse);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quiz History & Analytics</h1>
          <p className="text-gray-600 mt-2">Track your progress and get personalized recommendations</p>
        </header>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Practice Days</p>
                <p className="text-2xl font-bold">{stats.totalPracticeDays}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <BookOpen className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Attempts</p>
                <p className="text-2xl font-bold">{stats.totalAttempts}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 flex items-center">
              <div className="rounded-full bg-amber-100 p-3 mr-4">
                <Award className="text-amber-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Quizzes Passed</p>
                <p className="text-2xl font-bold">{stats.passedQuizzes}/{stats.totalQuizzes}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Performance */}
            {stats && stats.coursePerformance.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Target className="mr-2" size={20} />
                  Course Performance
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.coursePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="courseName" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Average Score']} />
                      <Legend />
                      <Bar dataKey="averageScore" name="Average Score" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Daily Activity */}
            {stats && stats.dailyActivity.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="mr-2" size={20} />
                  Study Activity
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="attempts" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recommendations */}
          <div className="space-y-8">
            {/* AI Recommendations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Brain className="mr-2" size={20} />
                AI Recommendations
              </h2>
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start mb-2">
                        {rec.type === 'book' && <Bookmark className="text-blue-500 mr-2 mt-1" size={16} />}
                        <p className="font-medium">{rec.title || 'Recommendation'}</p>
                      </div>
                      <p className="text-gray-700 text-sm">{rec.message}</p>
                      {rec.author && <p className="text-gray-600 text-xs mt-1">By {rec.author}</p>}
                      {rec.course && <p className="text-gray-600 text-xs mt-1">Course: {rec.course}</p>}
                      {rec.link && (
                        <a href={rec.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs mt-2 block">
                          View Resource
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No recommendations available yet. Complete more quizzes to get personalized suggestions.</p>
                )}
              </div>
            </div>

            {/* Weak Areas Radar Chart */}
            {stats && stats.coursePerformance.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Performance by Course</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={stats.coursePerformance}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="courseName" />
                      <PolarRadiusAxis />
                      <Radar name="Performance" dataKey="averageScore" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quiz Attempts History */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Quiz Attempt History</h2>
            <select 
              title='Math'
              className="border rounded-md px-3 py-2"
              value={selectedCourse}
              onChange={(e) => handleCourseFilterChange(e.target.value)}
            >
              <option value="all">All Courses</option>
              {stats?.coursePerformance.map(course => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          {attempts.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {attempts.map((attempt) => {
    // 🟢 Fix: Check if quizId is null before rendering the row
    if (!attempt.quizId) {
        return (
            <tr key={attempt._id}>
                <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">
                    This quiz attempts data is incomplete or the quiz was deleted.
                </td>
            </tr>
        );
    }
    
    // If quizId exists, render the full row as normal
    return (
        <tr key={attempt._id}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{attempt.quizId.quizTitle}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{attempt.quizId.courseID.courseName}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {new Date(attempt.completedAt).toLocaleDateString()}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {attempt.score}% ({attempt.correctAnswers}/{attempt.totalQuestions})
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {Math.floor(attempt.timeSpent / 60)}m {attempt.timeSpent % 60}s
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    attempt.score >= attempt.quizId.passingScore 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {attempt.score >= attempt.quizId.passingScore ? 'Passed' : 'Failed'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    onClick={() => {
                        window.location.href = `/quiz/attempt/${attempt.quizId._id}`;
                    }}
                >
                    Re-attempt
                </button>
                <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={() => {
                        window.location.href = `/quiz/result/${attempt._id}`;
                    }}
                >
                    View Details
                </button>
            </td>
        </tr>
    );
})}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No quiz attempts found.</p>
              <button 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => (window.location.href = '')}
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;