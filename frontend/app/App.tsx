'use client';

import { useState } from 'react';
import { useAuth } from './Provider';
import {
  LayoutDashboard,
  Bell,
  Search,
  BookOpen,
  History,
  LogOut,
} from 'lucide-react';
import { Settings } from 'lucide-react';
import NavLink from './components/NavLink';
import Courses from './pages/Courses';
import HistoryPage from './pages/HistoryPage';
import CourseDetails from './pages/CourseDetails';
import TakeQuiz from './pages/TakeQuiz';
import Alert from './components/Alert';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Image from 'next/image';

function App() {
  const [currentPage, setCurrentPage] = useState('Courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const { 
    user, 
    isLoggedIn, 
    logout, 
    isAuthReady 
  } = useAuth();

  const AuthFlow = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { login } = useAuth();

    const handleLoginSuccess = (userData, userToken) => {
      login(userData, userToken);
    };

    const handleRegisterSuccess = (userData, userToken) => {
      login(userData, userToken);
    };

    return (
      <div className="flex font-sans text-gray-800 p-5">
        <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto rounded-2xl  shadow-2xl overflow-hidden">
          {/* Visual Side with images and text */}
          <div className="md:w-1/2 bg-indigo-600 p-8 sm:p-5 flex flex-col justify-center items-center text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-600 opacity-90"></div>
            </div>
            <div className="z-10">
              <h2 className="text-4xl font-extrabold leading-tight mb-2">
                {isLoginView ? 'Welcome Back!' : 'Join the Community!'}
              </h2>
              <p className="text-indigo-100 text-lg mb-2 max-w-sm mx-auto">
                {isLoginView ? 'Log in to continue your learning journey and track your progress.' : 'Create an account to access thousands of courses and quizzes.'}
              </p>
              <Image
                width={400}
                height={300}
                src={isLoginView ? "/need.png" : "/need.png"}
                alt="Illustration of learning"
                className="mt-2 rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
          {/* Form Side */}
          <div className="md:w-1/2 p-8 sm:p-2 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">BuzzQuizz</h1>
            <p className="text-gray-600 mb-2 text-lg">
              {isLoginView ? 'Sign in to your account' : 'Start your free account'}
            </p>
            {isLoginView ? (
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigateToRegister={() => setIsLoginView(false)}
              />
            ) : (
              <RegisterPage
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateToLogin={() => setIsLoginView(true)}
              />
            )}
            <div className="mt-8 text-center text-sm text-gray-500">
              {isLoginView ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                className="font-medium text-indigo-600 hover:text-indigo-500 ml-2 transition-colors duration-200"
              >
                {isLoginView ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    if (!isLoggedIn) {
      return <AuthFlow />;
    }
    
    if (selectedQuiz) {
      return (
        <TakeQuiz
          quiz={selectedQuiz}
          onFinish={() => {
            
            setSelectedQuiz(null);
            setSelectedCourse(null);
            setCurrentPage('Courses');
          }}
        />
      );
    }

    if (selectedCourse) {
      return (
        <CourseDetails
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onQuizClick={setSelectedQuiz}
        />
      );
    }

    switch (currentPage) {
      case 'Courses':
        return (
          <Courses
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
            setShowAlert={setShowAlert}
            isUserAdmin={user?.role === 'admin'}
            onCourseClick={setSelectedCourse}
          />
        );
      case 'History':
        return <HistoryPage />;
      default:
        return (
          <Courses
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
            setShowAlert={setShowAlert}
            isUserAdmin={user?.role === 'admin'}
            onCourseClick={setSelectedCourse}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen font-sans text-gray-800">
      {/* Sidebar - Only show when logged in */}
      {isLoggedIn && (
        <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 mb-10">
              <LayoutDashboard className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">BuzzQuizz</h1>
            </div>
            
            <nav className="space-y-2">
              <NavLink
                icon={<BookOpen className="w-5 h-5" />}
                label="Courses"
                active={currentPage === 'Courses'}
                onClick={() => {
                  setCurrentPage('Courses');
                  setSelectedCourse(null);
                  setSelectedQuiz(null);
                }}
              />
              
              <NavLink
                icon={<History className="w-5 h-5" />}
                label="History"
                active={currentPage === 'History'}
                onClick={() => {
                  setCurrentPage('History');
                  setSelectedCourse(null);
                  setSelectedQuiz(null);
                }}
              />
              <NavLink 
              icon={<LogOut className="w-5 h-5" />} 
              label="Logout" 
              onClick={logout} 
            />
            </nav>
          </div>

        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {isLoggedIn && (
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {selectedCourse?.courseName || currentPage}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                
              </div>
              
              <button className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300 rounded-full hover:bg-gray-200">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              {user && (
                <div className="flex items-center space-x-2">
                  <Image
                    width={40}
                    height={40}
                    src="/need.png"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                  />
                  <span className="text-sm font-medium hidden md:block">
                    {user.username}
                  </span>
                </div>
              )}
            </div>
          </header>
        )}
        
        <div className="p-1 md:p-2">
          {renderPage()}
        </div>
      </main>

      {showAlert && (
        <Alert 
          message={alertMessage} 
          type={alertType} 
          onClose={() => setShowAlert(false)} 
        />
      )}
    </div>
  );
}

export default App;