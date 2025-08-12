import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ResponseManager = () => {
    const [responses, setResponses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null); // Track selected student
    const { quizId } = useSelector((state) => state.other);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/response/quiz/${quizId}`);
                setResponses(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchResponses();
        }
    }, [quizId]);

    const handleDelete = async (responseID) => {
        try {
            await axios.delete(`http://localhost:8000/api/response/${responseID}`);
            setResponses(responses.filter(response => response.ResponseID !== responseID));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStudentSelect = (studentId) => {
        setSelectedStudent(studentId === selectedStudent ? null : studentId);
    };

    const calculateTotalScore = (studentId) => {
        const studentResponses = responses.filter(response => response.UserID === studentId);
        return studentResponses.filter(response => response.IsCorrect).length * 10;
    };

    if (loading) return <h3 className="text-center text-gray-500">Loading...</h3>;
    if (error) return <h3 className="text-center text-red-500">Error: {error}</h3>;

    const uniqueStudents = [...new Map(responses.map(item => [item.UserID, item])).values()];

    return (
        <div className="w-full flex flex-col justify-center items-center font-serif gap-2 pt-2 bg-blue-300 h-screen "
          style={{
            backgroundImage: `url(quiz4.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}>
            <h1 className="backdrop-blur-sm border-2 border-white w-1/6 font-serif text-2xl text-black flex justify-center rounded-md p-4">
                User Responses
            </h1>
            {uniqueStudents.length === 0 ? (
                <p className="text-gray-600">No responses found.</p>
            ) : (
                <div className="backdrop-blur-sm border-2 border-white w-1/6 font-serif text-2xl text-black flex justify-center rounded-md p-4">
                    {uniqueStudents.map(student => (
                        <div key={student.UserID} className="student-response-summary text-3xl">
                            <button
                                onClick={() => handleStudentSelect(student.UserID)}
                                className="text-black font-2xl underline hover:underline"
                            >
                                {student.FirstName} {student.LastName}
                            </button>
                            <span className="text-blue-600 ml-4 space-x-1 text-xl">
                                Score: {calculateTotalScore(student.UserID)}
                            </span>

                            {selectedStudent === student.UserID && (
                                <table className="w-full p-2 bg-blue-400 mt-2">
                                    <thead>
                                        <tr>
                                            <th className="border-2 p-2">Question</th>
                                            <th className="border-2 p-2">Chosen Option</th>
                                            <th className="border-2 p-2">Answer Text</th>
                                            <th className="border-2 p-2">Is Correct</th>
                                            <th className="border-2 p-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-black bg-blue-300">
                                        {responses
                                            .filter(response => response.UserID === student.UserID)
                                            .map(response => (
                                                <tr key={response.ResponseID}>
                                                    <td className="border-2 text-center">{response.QuestionText}</td>
                                                    <td className="border-2 text-center">{response.ChosenOption}</td>
                                                    <td className="border-2 text-center">{response.AnswerText}</td>
                                                    <td className="border-2 text-center">
                                                        <span
                                                            className={`py-1 px-3 rounded-full text-sm ${
                                                                response.IsCorrect
                                                                    ? 'bg-green-200 text-green-700'
                                                                    : 'bg-red-200 text-red-700'
                                                            }`}
                                                        >
                                                            {response.IsCorrect ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td className="rounded-sm border-2 text-center bg-blue-500 hover:bg-red-600">
                                                        <button
                                                            onClick={() => handleDelete(response.ResponseID)}
                                                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResponseManager;


{/* // import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const ResponseManager = () => {
//     const [responses, setResponses] = useState([]);
//     const [error, setError] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Fetch all responses on component mount
//         const fetchResponses = async () => {
//             try {
//                 const res = await axios.get('http://localhost:8000/api/response/'); // Adjust the endpoint accordingly
//                 // Ensure the data is an array
//                 setResponses(Array.isArray(res.data) ? res.data : []);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchResponses();
//     }, []);

//     // Function to delete a response
//     const handleDelete = async (responseID) => {
//         try {
//             await axios.delete(`http://localhost:8000/api/response/${responseID}`);
//             setResponses(responses.filter(response => response.ResponseID !== responseID));
//         } catch (err) {
//             setError(err.message);
//         }
//     };

//     if (loading) return <h3>Loading...</h3>;
//     if (error) return <h3>Error: {error}</h3>;

//     return (
//         <div className='bg-red-200'>
//             <h2 className='text-black'>User Responses</h2>
//             {responses.length === 0 ? (
//                 <p className='text-black'>No responses found.</p>
//             ) : (
//                 <table>
//                     <thead>
//                         <tr>
//                             <th>User</th>
//                             <th>Question</th>
//                             <th>Chosen Option</th>
//                             <th>Answer Text</th>
//                             <th>Is Correct</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className='text-black bg-green-300'>
//                         {responses.map(response => (
//                             <tr key={response.ResponseID}>
//                                 <td>{response.FirstName} {response.LastName}</td>
//                                 <td>{response.QuestionText}</td>
//                                 <td>{response.ChosenOption}</td>
//                                 <td>{response.AnswerText}</td>
//                                 <td>{response.IsCorrect ? 'Yes' : 'No'}</td>
//                                 <td>
//                                     <button onClick={() => handleDelete(response.ResponseID)}>Delete</button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default ResponseManager; */}
