'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const LoginPage = ({ onLoginSuccess, onNavigateToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      // Added a check to handle non-JSON responses gracefully
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await response.text();
        throw new Error(errorText || 'Server returned a non-JSON response.');
      }
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      
   
      const user = { 
        userId: data.userId, 
        role: data.role,
        username: username // We use the username from the state since it's not in the response
      };
      onLoginSuccess(user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
     
     
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">  
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
           
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
             
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <div className='flex p-4 pl-2'> Username:Nusrat, Password:jerin</div>
       
      </div>
    </div>
  );
};

export default LoginPage;
