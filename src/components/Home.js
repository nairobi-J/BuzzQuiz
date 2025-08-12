import React, { useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { clearUser, setUser } from '../redux/user_reducer';
import { Button } from '@mui/material';

export default function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //  const isLoggedIn = true;
    // const userName = "jerin"
    // const userRole = "admin";
    // // const userRole = "user";
    const { userName, userRole, isLoggedIn } = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('userId');

            if (token && id) {
                try {
                    const response = await axios.get(
                        `http://localhost:8000/api/user/${id}`,
                        {
                            headers: {
                                Authorization: `${token}`,
                            },
                        }
                    );

                    const user = response.data;

                    dispatch(
                        setUser({
                            userId: user.UserID,
                            userName: user.Username,
                            userRole: user.UserRole,
                        })
                    );
                } catch (error) {
                    console.error('Error verifying token:', error);
                    dispatch(clearUser());
                }
            } else {
                dispatch(clearUser());
            }
        };

        verifyUser();
    }, [dispatch]);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        dispatch(clearUser());
        navigate('/');
    }

    function navigateToQuiz() {
        navigate('/course_view');
    }
    function navigateToLogin() {
        navigate('/login');
    }
    function handleCourse() {
        navigate('/course');
    }
    function navigateToResponse() {
        navigate('/response')
    }
    

    return (
        <div className="home_body font-serif h-screen  flex flex-col r justify-center items-center"
        style={{ backgroundImage: `url(quiz3.webp)` }}>
            {/* Header */}
           
          
            <div className="header_body  w-full  max-w-5xl mx-auto px-10 py-5  flex  justify-between backdrop-blur-md shadow-md border-2 border-black rounded-md ">
           
                <div className="app_title text-2xl font-bold text-blue-900 font-sans">
                    BuzzQuizz
                </div>
                {isLoggedIn ? (
                    <div className="user-menu relative group  justify-center items-center">
                        {/* User Info (trigger) */}
                        <div className="user-info flex items-center cursor-pointer gap-2">
                        <span className=" text-blue-900 font-bold text-lg capitalize font-serif ">{userName}</span>
                            <span className=" text-gray-400 text-lg  font-serif ">({userRole})</span>
                            <ArrowDropDownIcon className="ml-2" />
                        </div>
                        
                        {/* Dropdown content */}
                        <div className="dropdown-content absolute right-0 mt-0 bg-white shadow-lg rounded-md z-20 w-48 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 ease-in-out">
                           
                            {userRole === 'admin' && (
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                    onClick={handleCourse}
                                >
                                    Courses
                                </button>
                            )}
                            <button
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                      
                       <button className=' border-2 text-white bg-blue-900 hover:bg-gray-200 hover:text-black pt-2 pr-2 pl-2 pb-2 rounded-md hover:p-3'
                            onClick={navigateToLogin}
                        >
                            Log In
                        </button>
                    </div>
                )}
            </div>

            {/* Main Body */}
            <div className="body_layout mt-16 text-center">
                <div className="title_body text-4xl font-bold backdrop-blur-xl  p-5  text-black mb-8">
                    Give Your Academic Exams <br />
                    with <span className="text-blue-950  font-extralight underline  hover:text-gray-500">BuzzQuizz!</span>
                </div>

               
                <div className="exam_btn">
                      
                {userRole === 'admin' && (

                   
                                <button
                                className="bg-blue-900 hover:bg-gray-200 hover:text-black text-white py-3 px-6 rounded-lg text-lg"
                                onClick={navigateToQuiz}
                            >
                                
                                Enlist Teacher
                            </button>

                         

                            
                            )}
                             {userRole === 'student' && (
                                <button
                                className="bg-blue-900 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg"
                                onClick={navigateToQuiz}
                            >
                                
                                Take Exam
                            </button>
                            
                            )}
                             {userRole === 'teacher' && (
                                <button
                                className="bg-blue-900 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg"
                                onClick={navigateToQuiz}
                            >
                                
                                Create Quiz
                            </button>
                            )}
                   
                </div>

                <div className='mt-4'>
                {userRole === 'admin' && (

                   
<button
className="bg-blue-900 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg"
onClick={handleCourse}
>
 Course
</button>




)}

                </div>
               
                <div>
                    
                </div>
            </div>
            </div>
    
    );
}
