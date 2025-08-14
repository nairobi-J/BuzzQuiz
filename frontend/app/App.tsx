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
// Add to your existing lucide-react imports
import { Settings } from 'lucide-react';  // Add this line
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

  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  const renderPage = () => {
    if (!isLoggedIn) {
      return (
        <AuthFlow />
      );
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

  const AuthFlow = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { login } = useAuth();
  
    const handleLoginSuccess = (userData, userToken) => {
      login(userData, userToken);
    };
  
    const handleRegisterSuccess = (userData, userToken) => {
      login(userData, userToken);
    };
  
    return isLoginView ? (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onNavigateToRegister={() => setIsLoginView(false)} 
      />
    ) : (
      <RegisterPage 
        onRegisterSuccess={handleRegisterSuccess} 
        onNavigateToLogin={() => setIsLoginView(true)} 
      />
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 mb-10">
            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">EduDash</h1>
          </div>
          
          {isLoggedIn && (
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
            </nav>
          )}
        </div>

        <div className="">
          {isLoggedIn ? (
            <NavLink 
              icon={<LogOut className="w-5 h-5" />} 
              label="Logout" 
              onClick={logout} 
            />
          ) : (
            <NavLink 
              icon={<Settings className="w-5 h-5" />} 
              label="Settings" 
            />
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {selectedCourse?.courseName || currentPage}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            {isLoggedIn && (
              <button className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300 rounded-full hover:bg-gray-200">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            )}
            
            {user && (
              <div className="flex items-center space-x-2">
                <Image
                  width={40}
                  height={40}
                  src="https://placehold.co/40x40/d1d5db/000000?text=JD"
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
        
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
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