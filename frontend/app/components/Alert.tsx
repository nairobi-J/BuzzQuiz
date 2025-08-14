'use client';

import { useEffect } from 'react';

const Alert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${bgColor} z-50 transition-opacity duration-300`}>
      {message}
    </div>
  );
};

export default Alert;