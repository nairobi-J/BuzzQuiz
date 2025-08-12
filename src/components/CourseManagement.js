import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClipboardCheck, FaMale, FaTasks } from 'react-icons/fa';
import '../styles/Course.css';

export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [newCourse, setNewCourse] = useState({
        CourseName: '',
        TeacherID: '',
    });
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/course/all');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/response/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const createCourse = async () => {
        if (!newCourse.CourseName) {
            alert('Please enter a course name.');
            return;
        }
        try {
            await axios.post('http://localhost:8000/api/course/', newCourse);
            setNewCourse({ CourseName: '', TeacherID: '' });
            fetchCourses();
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const assignTeacherToCourse = async () => {
        if (!selectedTeacher || !selectedCourse) {
            alert('Please select both a teacher and a course.');
            return;
        }
        try {
            await axios.put(`http://localhost:8000/api/course/${selectedCourse}/assign`, {
                TeacherID: selectedTeacher,
            });
            alert('Teacher assigned to course successfully.');
            setSelectedTeacher('');
            setSelectedCourse('');
            fetchCourses();
        } catch (error) {
            console.error('Error assigning teacher:', error);
        }
    };

    return (
        <div className="w-screen flex flex-col items-center gap-4 font-serif text-black"
             style={{ backgroundImage: `url(quiz4.webp)` }}>
            
            <h1 className="font-serif text-black font-extralight border-2 border-white rounded-md backdrop-blur-md p-4">
                Course Management
            </h1>

            {/* Course Creation Section */}
            <div className="bg-blue-300 rounded-md p-6 flex flex-col items-center gap-5 border-2 border-white w-4/5">
                <h2 className="font-semibold text-lg">Create New Course</h2>
                <input
                    type="text"
                    className="border-2 h-10 w-80 rounded-md"
                    placeholder="Course Name"
                    value={newCourse.CourseName}
                    onChange={(e) => setNewCourse({ ...newCourse, CourseName: e.target.value })}
                />
                <button onClick={createCourse} className="h-10 w-40 font-serif font-extralight bg-white rounded-md hover:bg-blue-200">
                    Create Course
                </button>
            </div>

            {/* Teacher Assignment Section */}
            <div className="flex flex-col items-center bg-white border-2 border-blue-700 rounded-md p-6 w-4/5 mt-6">
                <h2 className="font-semibold text-lg flex items-center gap-2 bg-blue-300 p-4 rounded-md">
                    <FaClipboardCheck size={20} color="navy" /> Assign Teacher to Course
                </h2>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center gap-4">
                        <FaMale size={20} color="navy" />
                        <label>Select Teacher:</label>
                        <select
                            className="border-2 h-10 w-72 rounded-md"
                            value={selectedTeacher}
                            onChange={(e) => setSelectedTeacher(e.target.value)}
                        >
                            <option value="">-Select Teacher-</option>
                            {teachers.map((teacher) => (
                                <option key={teacher.UserID} value={teacher.UserID}>
                                    {teacher.FirstName} {teacher.LastName} (ID: {teacher.UserID})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-4">
                        <FaTasks size={20} color="navy" />
                        <label>Select Course:</label>
                        <select
                            className="border-2 h-10 w-72 rounded-md"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">-Select Course-</option>
                            {courses.map((course) => (
                                <option key={course.CourseID} value={course.CourseID}>
                                    {course.CourseName} (ID: {course.CourseID})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={assignTeacherToCourse} className="bg-blue-900 hover:bg-gray-200 hover:text-black text-white rounded-md p-2">
                        Assign Teacher
                    </button>
                </div>
            </div>

            {/* Course Table */}
            <div className="course_table mt-6 w-4/5 bg-white border-2 border-gray-300 rounded-md">
                <h2 className="font-sans font-semibold p-4 bg-blue-300 rounded-t-md">Courses</h2>
                <table className="w-full text-center">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>Course ID</th>
                            <th>Course Name</th>
                            <th>Teacher ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.CourseID} className="border-b border-gray-300">
                                <td>{course.CourseID}</td>
                                <td>{course.CourseName}</td>
                                <td>{course.TeacherID}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
