import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import '../styles/TeacherEnlistment.css';
import { FaClipboardCheck, FaMale, FaTasks} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

export default function TeacherEnlistment() {
    const navigate = useNavigate();
    const [teachers, setTeachers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    function handleCourse() {
        navigate('/course');
    }

    useEffect(() => {
        fetchTeachers();
        fetchCourses();
    }, []);

    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/response/teachers');
            setTeachers(response.data);
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/course/all');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const assignTeacherToCourse = async () => {
        if (!selectedTeacher || !selectedCourse) {
            alert('Please select both a teacher and a course.');
            return;
        }

        try {
            await axios.put(`http://localhost:8000/api/course/${selectedCourse}`, {
                TeacherID: selectedTeacher,
            });
            alert('Teacher assigned to course successfully.');
            setSelectedTeacher('');
            setSelectedCourse('');
            handleCourse();
        } catch (error) {
            console.error('Error assigning teacher:', error);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col   font-serif text-black  justify-center items-center gap-4" 
        style={{
            backgroundImage: `url(quiz4.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}>
            <div className="" >
            <h2 className=' font-semibold border-2 border-blue-900 flex flex-row justify-center items-center backdrop-blur-lg rounded-md pt-4 pb-4 pr-2 pl-2 gap-1 backdrop-blur-lg'>
                <FaClipboardCheck size={20} color='navy'/>
                Assign Teacher to Course:</h2>
            </div>
          <div className='flex justify-center w-50% '>
            <div className=" pl-10 pr-10 pb-10 pt-10 flex flex-col justify-center items-center gap-5 backdrop-blur-lg border-2 border-blue-700 rounded-md  ">
              
                <div className='flex justify-center items-center gap-2'>
                <FaMale size={20} color='navy'/>
                    <label htmlFor="teacher-select" className=''>Select Teacher:</label>
                   
                    <select
                        className="border-2 h-10 w-70 rounded-md pl-2"
                        id="teacher-select"
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                    >
                        
                        <option value="" className='text-black'>-Select Teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.UserID} value={teacher.UserID}>
                                {teacher.FirstName} {teacher.LastName} (ID: {teacher.UserID})
                            </option>
                        ))}
                    </select>
                </div>

                <div className='flex justify-center items-center gap-4'>
                    <FaTasks size={20} color='navy'/>
                    <label htmlFor="course-select" className=' text-black '>Select Course:</label>
                   
                    <select
                       className="border-2 h-10 w-70 rounded-md"
                        id="course-select"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="" className='text-black'>-Select  Course</option>
                        {courses.map((course) => (
                            <option key={course.CourseID} value={course.CourseID}>
                                {course.CourseName} (ID: {course.CourseID})
                            </option>
                        ))}
                    </select>
                </div>

                <button onClick={assignTeacherToCourse} className='  bg-blue-900 hover:bg-gray-200 hover:text-black  rounded-md p-2 text-white'>Assign Teacher</button>
            </div> </div>
        </div>
    );
}
