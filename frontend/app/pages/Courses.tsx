'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, BookOpen } from 'lucide-react';
import CourseModal from '../components/CourseModal';

const Courses = ({ setAlertMessage, setAlertType, setShowAlert, isUserAdmin, onCourseClick }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/course/all');
        if (!response.ok) {
          throw new Error('Failed to fetch courses.');
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setAlertMessage('Failed to fetch courses. Please check the server.');
        setAlertType('error');
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [setAlertMessage, setAlertType, setShowAlert]);

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCourse = (courseName, courseDetails) => {
    const newCourse = {
      _id: crypto.randomUUID(),
      courseName,
      details: courseDetails,
      teacherID: 'mockTeacherID',
      createdAt: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
    setShowModal(false);
    setAlertMessage('Course created successfully!');
    setAlertType('success');
    setShowAlert(true);
  };

  const handleCreateButtonClick = () => {
    if (isUserAdmin) {
      setShowModal(true);
    } else {
      setAlertMessage('You need to be an admin to create a course.');
      setAlertType('error');
      setShowAlert(true);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-auto flex-grow mr-0 md:mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent transition-all duration-300" />
        </div>
        <button onClick={handleCreateButtonClick} className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white font-semibold  hover:bg-indigo-700 transition-colors duration-300">
          <Plus className="w-5 h-5" />
          <span>Create Course</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map(course => (
              <div
                key={course._id}
                onClick={() => onCourseClick(course)} // This is the new click handler
                className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <BookOpen className="w-8 h-8 text-indigo-500" />
                  <h4 className="text-xl font-semibold">{course.courseName}</h4>
                </div>
                <p className="text-gray-600 text-sm mb-4">{course.details}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Teacher: {course.teacherID}</span>
                  <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">No courses found.</div>
          )}
        </div>
      )}
      <CourseModal isOpen={showModal} onClose={() => setShowModal(false)} onCreate={handleCreateCourse} />
    </div>
  );
};

export default Courses;