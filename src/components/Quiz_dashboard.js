// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import '../styles/Course_dashboard.css';
// import { setQuizID } from '../redux/other_reducer';

// const AllQuizzes = () => {
//     const [quizzes, setQuizzes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const dispatch = useDispatch();
//     const { courseId } = useSelector((state) => state.other);

//     useEffect(() => {
//         const fetchQuizzes = async () => {
//             try {
//                 const response = await axios.get(
//                     `http://localhost:8000/api/quiz/course/${courseId}`
//                 );
//                 setQuizzes(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching courses:', error);
//                 setLoading(false);
//             }
//         };

//         fetchQuizzes();
//     }, [courseId]);

//     const handleQuizId = (quizzId) => {
//         dispatch(setQuizID(quizzId));
//     };

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <div className="courses-container">
//             <h2>All Quizzes</h2>
//             <div className="grid-container">
//                 {quizzes?.map((quizz) => (
//                     <div key={quizz?.QuizID} className="course-card">
//                         <h3>{quizz?.QuizTitle}</h3>
//                         <Link
//                             to={`/quiz`}
//                             className="btn"
//                             onClick={() => handleQuizId(quizz.QuizID)}
//                         >
//                             Take Exam
//                         </Link>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AllQuizzes;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/Course_dashboard.css';
import { setQuizID } from '../redux/other_reducer';

const AllQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { courseId } = useSelector((state) => state.other);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/quiz/course/${courseId}`
                );
                setQuizzes(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [courseId]);

    const handleQuizId = (quizId) => {
        dispatch(setQuizID(quizId));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full h-screen font-serif"   
        style={{
            backgroundImage: `url(quiz3.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}
        >
            <div className="quiz flex justify-center pt-4 pb-4">
            <h2 className='flex justify-center  backdrop-blur-lg w-1/6 border-2 border-white rounded-md pt-2 pb-2 text-2xl'>All Quizzes</h2>
            </div>
           
            <div className="
             grid grid-cols-5 gap-4 w-full 
            ">
                {quizzes?.map((quiz) => (
                    <div key={quiz?.QuizID} className="course-card backdrop-blur-lg">
                        <h3>{quiz?.QuizTitle}</h3>

                        {user?.userRole !== 'teacher' && (
                        <Link
                            to={`/quiz`}
                            className="btn text-white bg-blue-900 hover:bg-gray-200 hover:text-black  text-center p-2 rounded  font-extralight"
                            onClick={() => handleQuizId(quiz.QuizID)}
                        >
                            Take Exam
                        </Link>
                         )}

                        {user?.userRole === 'teacher' && (
                            <Link
                                to={`/response`}
                                className="btn text-white bg-blue-900 hover:bg-gray-200 hover:text-black  hover:p-2 text-center p-2 rounded  font-extralight"
                                onClick={() => handleQuizId(quiz.QuizID)}
                            >
                                View Responses
                            </Link>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllQuizzes;
