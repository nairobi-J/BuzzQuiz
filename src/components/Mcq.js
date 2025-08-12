// import React, { useEffect, useState } from 'react';
// import axios from 'axios';  // Import axios for API requests
// import '../styles/Mcq.css';
// import { useFetchQuizData } from '../hooks/FetchQuestion';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateResult } from '../hooks/setResult';
// import { FaQuestion } from 'react-icons/fa';

// export default function Mcq({ onChecked }) {
//     const [checked, setChecked] = useState(undefined);
//     const [{ isLoading, serverError }] = useFetchQuizData();
//     const trace = useSelector((state) => state.questions.trace);
//     const result = useSelector((state) => state.result.result);
//     const dispatch = useDispatch();
//     const questions = useSelector(
//         (state) => state.questions.queue[state.questions.trace]
//     );
//     const userId = useSelector((state) => state.user.userId); // Get the user ID from the store
//     const quizId = useSelector((state) => state.other.quizId); // Get the quiz ID from the store

//     useEffect(() => {
//         if (checked !== undefined) {
//             dispatch(updateResult({ trace, checked }));
//         }
//     }, [checked, dispatch, trace]);

//     const submitResponse = async (questionId, chosenOption, isCorrect) => {
//         try {
//             // Fetch the AnswerText from the Option table using chosenOption (OptionID)
//             const optionResponse = await axios.get(`http://localhost:8000/api/options/${chosenOption}`);
//             const answerText = optionResponse.data.OptionText;  // Assuming 'OptionText' is the field name for answer text

//             // Now submit the response with the fetched AnswerText
//             await axios.post('http://localhost:8000/api/response/', {
//                 UserID: userId,
//                 QuizID: quizId,
//                 QuestionID: questionId,
//                 ChosenOption: chosenOption,
//                 AnswerText: answerText,  // Use the fetched answer text
//                 IsCorrect: isCorrect,
//             });

//             console.log('Response submitted successfully');
//         } catch (error) {
//             console.error('Error submitting response:', error.message || error);
//         }
//     };

//     const onSelect = (optionId) => {
//         onChecked(optionId);
//         setChecked(optionId);

//         const isCorrect = questions?.Options.find(option => option.OptionID === optionId)?.IsCorrect;

//         // Submit response to the backend
//         if (questions) {
//             submitResponse(questions.QuestionID, optionId, isCorrect);
//         }
//     };

//     if (isLoading) return <h3 className="text-light">Loading...</h3>;
//     if (serverError) {
//         console.error(serverError);
//         return <h3 className="text-light">{serverError.message || 'Unknown Error'}</h3>;
//     }

//     return (
//         <div className="w-50% h-50% bg-blue-300 border-2 border-white rounded-md pt-4  pl-4  ">
//             <div className="qs flex gap-2">
//                 <FaQuestion size={30} />
//                 <h2 className="text-3xl underline flex items-center">
//                     {questions?.QuestionText}
//                 </h2> 
//             </div>
//             <div>
//             <ul key={questions?.QuestionID}>
//                 {questions?.Options.map((option) => (
//                     <li key={option.OptionID} className="flex ">
//                         {/* Hidden radio input */}
//                         <input
//                             type="radio"
//                             name="options"
//                             id={`q${option.OptionID}-option`}
//                             onChange={() => onSelect(option.OptionID)}
//                             className="hidden"
//                         />

//                         {/* Custom radio button */}
//                         <label
//                             className="text-black font-serif cursor-pointer flex flex-row gap-2 w-full"
//                             htmlFor={`q${option.OptionID}-option`}
//                         >
//                             <span
//                                 className={`w-5 h-5  rounded-full border-2 transition duration-20  ${
//                                     checked === option.OptionID ? 'bg-black border-2 border-black' : 'bg-white border-gray-400'
//                                 }`}
//                             ></span>
//                             <span className='text-black font-serif hover:text-gray-50'>
//                             {option.OptionText}
//                             </span>
                           
//                         </label>
//                     </li>
//                 ))}
//             </ul>
//             </div>
//         </div>
//     );
// }


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Mcq.css';
import { useFetchQuizData } from '../hooks/FetchQuestion';
import { useDispatch, useSelector } from 'react-redux';
import { updateResult } from '../hooks/setResult';
import { FaQuestion } from 'react-icons/fa';

export default function Mcq({ onChecked }) {
    const [checked, setChecked] = useState(undefined);
    const [textAnswer, setTextAnswer] = useState('');
    const [{ isLoading, serverError }] = useFetchQuizData();
    const trace = useSelector((state) => state.questions.trace);
    const result = useSelector((state) => state.result.result);
    const dispatch = useDispatch();
    const questions = useSelector((state) => state.questions.queue[state.questions.trace]);
    const userId = useSelector((state) => state.user.userId);
    const quizId = useSelector((state) => state.other.quizId);

    useEffect(() => {
        if (checked !== undefined) {
            dispatch(updateResult({ trace, checked }));
        }
    }, [checked, dispatch, trace]);

    const submitResponse = async (questionId, chosenOption, answerText, isCorrect) => {
        try {
            await axios.post('http://localhost:8000/api/response/', {
                UserID: userId,
                QuizID: quizId,
                QuestionID: questionId,
                ChosenOption: chosenOption,
                AnswerText: answerText,
                IsCorrect: isCorrect,
            });

            console.log('Response submitted successfully');
        } catch (error) {
            console.error('Error submitting response:', error.message || error);
        }
    };

    const onSelect = (optionId) => {
        onChecked(optionId);
        setChecked(optionId);

        const isCorrect = questions?.Options.find(option => option.OptionID === optionId)?.IsCorrect;

        if (questions) {
            submitResponse(questions.QuestionID, optionId, '', isCorrect);
        }
    };

    const onSubmitTextAnswer = () => {
        const isCorrect = false; 
        onChecked(textAnswer);
        setChecked(textAnswer);


        if (questions) {
            submitResponse(questions.QuestionID, null, textAnswer, isCorrect);
            setTextAnswer('');
        }
    };

    if (isLoading) return <h3 className="text-light">Loading...</h3>;
    if (serverError) {
        console.error(serverError);
        return <h3 className="text-light">{serverError.message || 'Unknown Error'}</h3>;
    }

    return (
        <div className="w-50% h-50% bg-blue-300 border-2 border-white rounded-md pt-4 pl-4"
        style={{
            backgroundImage: `url(quiz2.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}
        >
            <div className="qs flex gap-2">
                <FaQuestion size={30} />
                <h2 className="text-3xl underline flex items-center">
                    {questions?.QuestionText}
                </h2> 
            </div>
            <div>
                {(questions?.QuestionType === 'multiple-choice' || questions?.QuestionType === 'true/false') && (
                    <ul key={questions?.QuestionID}>
                        {questions?.Options.map((option) => (
                            <li key={option.OptionID} className="flex ">
                                <input
                                    type="radio"
                                    name="options"
                                    id={`q${option.OptionID}-option`}
                                    onChange={() => onSelect(option.OptionID)}
                                    className="hidden"
                                />
                                <label
                                    className="text-black font-serif cursor-pointer flex flex-row gap-2 w-full"
                                    htmlFor={`q${option.OptionID}-option`}
                                >
                                    <span
                                        className={`w-5 h-5 rounded-full border-2 transition duration-20 ${
                                            checked === option.OptionID ? 'bg-black border-2 border-black' : 'bg-white border-gray-400'
                                        }`}
                                    ></span>
                                    <span className="text-black font-serif hover:text-gray-50">
                                        {option.OptionText}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
               
                {questions?.QuestionType === 'short answer' && (
                    <div>
                        <input
                            type="text"
                            value={textAnswer}
                            onChange={(e) => setTextAnswer(e.target.value)}
                            placeholder="Type your answer here"
                            className="w-full p-2 mt-4 border rounded-md"
                        />
                        <button
                            onClick={onSubmitTextAnswer}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Submit Answer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
