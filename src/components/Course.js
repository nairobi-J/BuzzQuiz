import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Course.css';
import { useSelector } from 'react-redux';
import Slide from './Slide';
import { useNavigate } from 'react-router-dom';

export default function Course() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({
        CourseName: '',
       description: '',
    });
    const state = useSelector((state) => state);
    console.log(state);
    useEffect(() => {
        fetchCourses();
    }, []);

    function handleUpdate(){
        navigate('/teacher_enlist');
    }

    const fetchCourses = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/api/course/all'
            );
            setCourses(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const createCourse = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/api/course/',
                newCourse
            );
            const { courseId } = response.data;
            setNewCourse({ CourseName: '', description: '' });
            fetchCourses();
        } catch (error) {
            console.error('Error creating course:', error);
        }
    };

    const updateCourse = async (courseId) => {
        try {
            const course = courses.find((c) => c.CourseID === courseId);
            await axios.put(
                `http://localhost:8000/api/course/${courseId}`,
                course
            );
            fetchCourses();
            handleUpdate();
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    const deleteCourse = async (courseId) => {
        try {
            await axios.delete(`http://localhost:8000/api/course/${courseId}`);
            fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    return (
        <>
        <Slide/>
        <div className=" w-screen flex flex-col justify-center items-center gap-2 font-serif"  
         style={{
            backgroundImage: `url(quiz4.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}
        >
            
            <h1></h1>
            <h1 className='font-serif text-black font-extralight border-2 border-white rounded-md backdrop-blur-lg p-2 '>Course Management</h1>
            <div className="h-screen w-screen flex flex-col  items-center">
            <div className="backdrop-blur-lg   rounded-md flex flex-row justify-center items-center w-60% pt-10 pb-10 pr-10 pl-10 gap-5 border-2 border-white">
                
                <input
                    type="text"
                     className='border-2 h-10 w-80 rounded-md'
                    placeholder="  Course Name"
                    value={newCourse.CourseName}
                    onChange={(e) =>
                        setNewCourse({
                            ...newCourse,
                            CourseName: e.target.value,
                        })
                    }
                />
                <input
                    type="text"
                     className='border-2 h-10 w-80 rounded-md'
                    placeholder="  Description"
                    value={newCourse.TeacherID}
                    onChange={(e) =>
                        setNewCourse({
                            ...newCourse,
                            TeacherID: e.target.value,
                        })
                    }
                />
                <button onClick={createCourse} className="h-12 w-30 font-serif font-extralight  rounded-md text-white bg-blue-900 hover:bg-gray-200 hover:text-black pr-2 pl-2 "> Create Course</button>
            </div>
            <div className=" backdrop-blur-sm course_table">
                <h2 className='font-sans font-semibold backdrop-blur-lg'>Courses</h2>
                <table>
                    <thead>
                        <tr>
                            <th className='font-serif'>Course ID</th>
                            <th>Course Name</th>
                            <th>Teacher ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses?.map((course) => (
                            <tr key={course?.CourseID}>
                                <td>{course?.CourseID}</td>
                                <td>{course?.CourseName}</td>
                                <td>{course?.TeacherID}</td>
                                <td>
                                    <button className='hover:bg-green-500'
                                        onClick={() =>
                                            updateCourse(course.CourseID)
                                        }
                                    >
                                        Update
                                    </button>
                                    <button className='hover:bg-red-500'
                                        onClick={() =>
                                            deleteCourse(course.CourseID)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
        </>
    );
}
