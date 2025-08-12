import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Create_Quiz.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setQuizID } from '../redux/other_reducer';

const CreateQuizForm = () => {
    const navigate = useNavigate();
    const { courseId } = useSelector((state) => state.other);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        QuizTitle: '',
        Description: '',
        Duration: '',
        TeacherID: '',
        CourseID: courseId,
        StartTime: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8000/api/quiz/',
                formData
            );
            const { quizId } = response.data;

            dispatch(setQuizID(quizId));
            navigate('/create_questions');
        } catch (error) {
            console.error('Error creating quiz:', error);
        }
    };

    return (
        <div className=" w-full h-screen flex  flex-col justify-center items-center font-serif gap-5"
        style={{
            backgroundImage: `url(quiz2.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}
        >
            <h1 className='backdrop-blur-lg border-2 border-white w-1/6 font-serif text-4xl text-black flex justify-center rounded-md p-3'>Create Quiz</h1>
            <form onSubmit={handleSubmit} className='backdrop-blur-lg pt-5 pr-5 pl-5 pb-5 border-2 border-white flex-col gap-2 w-1/2 rounded-md flex justify-center items-center text-xl'>
                <div className="flex gap-6 items-center text-xl">
                    <div className="">Quiz Title:</div>
                    <input
                        className='border-2 rounded-lg  pt-2 pb-2 pr-6 pl-2 shadow-sm shadow-black'
                        type="text"
                        name="QuizTitle"
                        value={formData.QuizTitle}
                        onChange={handleChange}
                    />
                </div>
               
                <div className="flex gap-8 pt-3 items-center">
                    <div className="">Duration:</div>
                    <input
                        type="number"
                        className='border-2 rounded-lg  pt-2 pb-2 pr-5 pl-2 shadow-sm shadow-black'
                        name="Duration"
                        value={formData.Duration}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex gap-5 pt-3 items-center">
                    <div className="form-label">Teacher ID:</div>
                    <input
                        className='border-2 rounded-lg  pt-2 pb-2 pr-5 pl-2 shadow-sm shadow-black'
                        type="text"
                        name="TeacherID"
                        value={formData.TeacherID}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex gap-6 pt-3 items-center ">
                    <div className="form-label">Start Time:</div>
                    <input
                        className='border-2 rounded-lg  pt-2 pb-2 pr-2 pl-2 shadow-sm shadow-black'
                        type="datetime-local"
                        name="StartTime"
                        value={formData.StartTime}
                        onChange={handleChange}
                    />
                </div>
                <div className="flex gap-3 pt-3 items-center pb-4">
                    <div className="">Description:</div>
                    <textarea
                        className='border-2 rounded-lg  pt-2 pb-2 pr-5 pl-2 shadow-sm shadow-black'
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                    />
                </div>

                <div className='flex justify-center'>
                <button className=' border-2 border-blue-300 bg-white hover:bg-blue-500 pt-2 pr-2 pl-2 pb-2 rounded-md hover:p-3' type="submit">Create</button>
                </div>
               
            </form>
        </div>
    );
};

export default CreateQuizForm;
