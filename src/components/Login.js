// import React, { useState } from 'react';
// import '../styles/Login.css';
// import { Navigate, Link } from 'react-router-dom'; // Import Link from react-router-dom;
// import axios from 'axios';

// export default function Login() {
//     const [values, setValues] = useState({
//         userName: '',
//         password: '',
//     });

//     const handleInputChange = (event) => {
//         event.preventDefault();

//         const { name, value } = event.target;
//         setValues((values) => ({
//             ...values,
//             [name]: value,
//         }));
//     };

//     const [submitted, setSubmitted] = useState(false);
//     const [valid, setValid] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (values.userName && values.password) {
//             // Simulate login logic here, for now just dispatching username
//             setValid(true);
//             try {
//                 const response = await axios.post(
//                     'http://localhost:8000/api/user/login',
//                     values
//                 );
//                 const { userId, token } = response.data;
//                 console.log(response.data);
//                 localStorage.setItem('userId', userId);
//                 localStorage.setItem('token', token);
//             } catch (error) {
//                 console.error('Error logging in:', error);
//             }
//         }
//         setSubmitted(true);
//     };

//     return (
//         <div className="login_body font-serif gap-4 "
//         style = {{backgroundImage : `url(bg.jpg)`} }>
           
//             <form className="bg-blue-300  rounded-md flex flex-col justify-center items-center w-40% pt-10 pb-10 pr-10 pl-10 gap-5 border-2 border-white" onSubmit={handleSubmit}>
                
//                 <div className="title ">
//                 <hr /> 
//                 <h1 className= 'text-black font-serif font-bold  pl-2 pr-2'>  Log in  </h1>
//                 <hr/> 
//                 </div>
           
//                 {submitted && valid && (
//                     <Navigate to={'/'} replace="true"></Navigate>
//                 )}
//                 {!valid && (
//                     <div className=''>
//                     <label htmlFor="userName" className="px-3 font-semibold">
//                     Username:
//                   </label>
//                     <input
//                         className="border-2 h-10 w-80 rounded-md"
//                         type="text"
//                         placeholder="   John Snow.."
//                         name="userName"
//                         value={values.userName}
//                         onChange={handleInputChange}
//                     />
//                     </div>
//                 )}
//                 {submitted && !values.userName && (
//                     <span id="username-error">Please enter a username</span>
//                 )}

//                 {!valid && (
//                     <div>
//                       <label htmlFor="password" className="px-3 font-semibold">
//                       Password:
//                     </label>
//                     <input
//                         className="border-2 h-10 w-80 rounded-md"
//                         type="password"
//                         placeholder="    aB5%$we..."
//                         name="password"
//                         value={values.password}
//                         onChange={handleInputChange}
//                     /> </div>
//                 )}
//                 {submitted && !values.password && (
//                     <span id="password-error">Please enter a password</span>
//                 )}

//                 {!valid && (
//                     <div className='justify-center items-center'>
//                          <button className="h-12 w-20 font-semibold border rounded-md  bg-white hover:bg-blue-200 " type="submit">
//                         Login
//                     </button>
//                     </div>
                   
//                 )}

//                 {/* Link to Register Component */}
//                 <div className="register-link flex">
//                     <div>
//                     <p> Not registered?{' '}</p>
//                     </div>
                    
//                     <div className='underline text-blue-600 hover:text-gray-400'>
//                         <Link to="/register">Register here</Link>
//                         </div>
//                 </div>
//             </form>
//         </div>
//     );
// }


import React, { useState } from 'react';
import '../styles/Login.css';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

export default function Login() {
    const [values, setValues] = useState({
        userName: '',
        password: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [valid, setValid] = useState(false);
    const [error, setError] = useState(null); // Add error state
    const navigate = useNavigate(); // Initialize useNavigate

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues((values) => ({
            ...values,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setError(null); // Clear previous errors
        if (values.userName && values.password) {
            try {
                const response = await axios.post(
                    'http://localhost:8000/api/user/login',
                    values
                );
                const { userId, token } = response.data;
                localStorage.setItem('userId', userId);
                localStorage.setItem('token', token);
                setValid(true); // Set valid to true for successful login
                navigate('/'); // Navigate to home on successful login
            } catch (error) {
                setError('Invalid username or password'); // Set error message on login failure
                setValid(false);
            }
        } else {
            setError('Please fill in all fields');
        }
    };

    return (
        <div
            className="login_body font-serif gap-4"
            style={{
                backgroundImage: `url(quiz3.webp)`,
                backgroundSize: "cover", // Ensures the image covers the full page
                backgroundRepeat: "no-repeat", // Prevents the image from repeating
                backgroundPosition: "center", // Centers the image
              }}
        >
            <form
                className="backdrop-blur-lg rounded-md flex flex-col justify-center items-center w-40% pt-10 pb-10 pr-10 pl-10 gap-5 border-2 border-white"
                onSubmit={handleSubmit}
            >
                <div className="title">
                    <hr />
                    <h1 className="text-black font-serif font-bold pl-2 pr-2">
                        Log in
                    </h1>
                    <hr />
                </div>

                {error && (
                    <div className="text-red-500 font-semibold text-center">
                        {error}
                    </div>
                )}

                <div className="flex flex-col items-center">
                    <label htmlFor="userName" className="px-3 font-semibold">
                        Username:
                    </label>
                    <input
                        className="border-2 h-10 w-80 rounded-md"
                        type="text"
                        placeholder="   John Snow.."
                        name="userName"
                        value={values.userName}
                        onChange={handleInputChange}
                    />
                    {submitted && !values.userName && (
                        <span className="text-red-500">Please enter a username</span>
                    )}
                </div>

                <div className="flex flex-col items-center">
                    <label htmlFor="password" className="px-3 font-semibold">
                        Password:
                    </label>
                    <input
                        className="border-2 h-10 w-80 rounded-md"
                        type="password"
                        placeholder="    aB5%$we..."
                        name="password"
                        value={values.password}
                        onChange={handleInputChange}
                    />
                    {submitted && !values.password && (
                        <span className="text-red-500">Please enter a password</span>
                    )}
                </div>

                <div className="flex justify-center items-center">
                    <button
                        className="h-12 w-20 font-semibold border rounded-md bg-white hover:bg-blue-200"
                        type="submit"
                    >
                        Login
                    </button>
                </div>

                {/* Link to Register Component */}
                <div className="register-link flex">
                    <p> Not registered?{' '}</p>
                    <div className="underline text-white bg-blue-900 hover:bg-gray-200 hover:text-black ml-1">
                        <Link to="/register">Register here</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
