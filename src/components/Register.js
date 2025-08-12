import React, { useState } from 'react';
import '../styles/Register.css';
import { useDispatch } from 'react-redux';
import { setCourseName } from '../redux/question_reducer';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
    const dispatch = useDispatch();
    const [values, setValues] = useState({
        userName: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        courseName: '',
        userRole: 'student',
    });

    const handleInputChange = (event) => {
        event.preventDefault();

        const { name, value } = event.target;
        setValues((values) => ({
            ...values,
            [name]: value,
        }));
    };

    const [submitted, setSubmitted] = useState(false);
    const [valid, setValid] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            values.userName &&
            values.password &&
            values.firstName &&
            values.lastName &&
            values.email &&
            values.courseName
        ) {
            // Simulate registration logic here, for now just dispatching username and course name
            setValid(true);
            dispatch(setCourseName(values.courseName));
            try {
                const response = await axios.post(
                    'http://localhost:8000/api/user/register',
                    values
                );
                const { userId, token } = response.data;
                // Store the userId and token in the client (e.g., local storage, Redux store)
                localStorage.setItem('userId', userId);
                localStorage.setItem('token', token);
            } catch (error) {
                console.error('Error registering user:', error);
            }
        }
        setSubmitted(true);
    };

    return (
        <div className="register_body gap-4 font-serif "
        style={{
            backgroundImage: `url(quiz3.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}>
           
            <form className="bg-blue-300  rounded-md flex flex-col justify-center items-center w-40% pt-10 pb-10 pr-10 pl-10 gap-5 border-2 border-white" onSubmit={handleSubmit}>
            <div className="title ">
                <hr /> 
                <h1 className= 'text-black font-serif font-bold  pl-2 pr-2'>  Register  </h1>
                <hr/> 
                </div>
                {submitted && valid && (
                    <Navigate to={'/'} replace="true"></Navigate>
                )}
                {!valid && (
                      <div>
                      <label htmlFor="UserName" className="px-3 font-semibold">
                       User Name:
                     </label>
                    <input
                         className="border-2 h-10 w-80 rounded-md"
                        type="text"
                        placeholder="  John Snow"
                        name="userName"
                        value={values.userName}
                        onChange={handleInputChange}
                    /> </div>
                )}
                {submitted && !values.userName && (
                    <span id="username-error text-gray-100">Please enter a username</span>
                )}

                {!valid && (
                      <div>
                      <label htmlFor="password" className="px-3 font-semibold">
                       Password:
                     </label>
                    <input
                        className="border-2 h-10 w-80 rounded-md"
                        type="password"
                        placeholder=" as8Lks#$"
                        name="password"
                        value={values.password}
                        onChange={handleInputChange}
                    /> </div>
                )}
                {submitted && !values.password && (
                    <span id="password-error">Please enter a password</span>
                )}

                {!valid && (
                      <div>
                      <label htmlFor="Fist Name" className="px-3 font-semibold">
                       First Name:
                     </label>
                    <input
                         className="border-2 h-10 w-80 rounded-md"
                        type="text"
                        placeholder="  John"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleInputChange}
                    /> </div>
                )}
                {submitted && !values.firstName && (
                    <span id="first-name-error text-gray-100">
                        Please enter your first name
                    </span>
                )}

                {!valid && (
                      <div>
                      <label htmlFor="lastName" className="px-3 font-semibold">
                       Last Name:
                     </label>
                    <input
                        className="border-2 h-10 w-80 rounded-md"
                        type="text"
                        placeholder="  Snow"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleInputChange}
                    /> </div>
                )}
                {submitted && !values.lastName && (
                    <span id="last-name-error">
                        Please enter your last name
                    </span>
                )}

                {!valid && (
                      <div>
                      <label htmlFor="email" className="px-3 font-semibold">
                       Email:
                     </label>
                    <input
                        className="border-2 h-10 w-80 rounded-md"
                        type="email"
                        placeholder="  john@example.com"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                    />
                    </div>
                )}
                {submitted && !values.email && (
                    <span id="email-error">Please enter your email</span>
                )}

                {!valid && (
                    <div>
                     <label htmlFor="Course Name" className="px-3 font-semibold">
                      Course Name:
                    </label>
                    <input
                         className="border-2 h-10 w-80 rounded-md"
                        type="text"
                        placeholder="  physics"
                        name="courseName"
                        value={values.courseName}
                        onChange={handleInputChange}
                    />
                    </div>
                )}
                {submitted && !values.courseName && (
                    <span id="course-name-error">
                        Please enter a course name
                    </span>
                )}
               <div>
                     <label htmlFor="User Role" className="px-3 font-semibold">
                      User Role:
                    </label>
                <select
                     className="border-2 h-10 w-80 rounded-md"
                    name="userRole"
                    value={values.userRole}
                    onChange={handleInputChange}
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
     </div>
                {!valid && (
                    <button className="h-12 w-20 font-semibold border rounded-md text-white bg-blue-900 hover:bg-gray-200 hover:text-black p-2 " type="submit">
                    Register
                </button>
                )}
            </form>
        </div>
    );
}
