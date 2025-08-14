'use client';

import { useState, createContext, useContext, useEffect } from 'react';
import {
  LayoutDashboard,
  Bell,
  Search,
  BookOpen,
  MessageSquare,
  User as UserIcon,
  History,
  Settings,
  Plus,
  LogOut,
  ArrowLeft,
  X,
  Clock,
  Loader2,
} from 'lucide-react';

import NavLink from './components/NavLink';
import Courses from './pages/Courses';
import Chat from './pages/Chat';
import UserPage from './pages/UserPage';
import HistoryPage from './pages/HistoryPage';
import CourseDetails from './pages/CourseDetails';
import TakeQuiz from './pages/TakeQuiz';
import Alert from './components/Alert';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


// AuthContext and AuthProvider must be defined in the same file as App.
const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
    setIsAuthReady(true);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setRole(userData.role);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userData.role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  const authState = {
    user,
    token,
    role,
    isLoggedIn: !!user,
    isAuthReady,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};


const AuthFlow = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login } = useContext(AuthContext);

  const handleLoginSuccess = (userData, userToken) => {
    login(userData, userToken);
  };

  const handleRegisterSuccess = (userData, userToken) => {
    login(userData, userToken);
  };

  return isLoginView ? (
    <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setIsLoginView(false)} />
  ) : (
    <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={() => setIsLoginView(true)} />
  );
};

export function App() {
  const [currentPage, setCurrentPage] = useState('Courses');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const isUserAdmin = false; // This will be dynamic from auth context later
  const { isLoggedIn, logout, user, isAuthReady } = useContext(AuthContext);

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
            isUserAdmin={isUserAdmin}
            onCourseClick={setSelectedCourse}
          />
        );
      case 'Chat':
        return <Chat />;
      case 'User':
        return <UserPage />;
      case 'History':
        return <HistoryPage />;
      default:
        return (
          <Courses
            setAlertMessage={setAlertMessage}
            setAlertType={setAlertType}
            setShowAlert={setShowAlert}
            isUserAdmin={isUserAdmin}
            onCourseClick={setSelectedCourse}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
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
        <div className="">
          {isLoggedIn ? (
            <NavLink icon={<LogOut className="w-5 h-5" />} label="Logout" onClick={logout} />
          ) : (
            <NavLink icon={<Settings className="w-5 h-5" />} label="Settings" />
          )}
        </div>
        </div>

      </aside>

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
                <img
                  src="https://placehold.co/40x40/d1d5db/000000?text=JD"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-indigo-500"
                />
                <span className="text-sm font-medium hidden md:block">{user.username}</span>
              </div>
            )}
          </div>
        </header>
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          {renderPage()}
        </div>
      </main>
      {showAlert && (
        <Alert message={alertMessage} type={alertType} onClose={() => setShowAlert(false)} />
      )}
    </div>
  );
}

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
