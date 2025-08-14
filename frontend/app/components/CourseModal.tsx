'use client';

import { useState } from 'react';

const CourseModal = ({ isOpen, onClose, onCreate }) => {
  const [courseName, setCourseName] = useState('');
  const [courseDetails, setCourseDetails] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (courseName && courseDetails) {
      onCreate(courseName, courseDetails);
      setCourseName('');
      setCourseDetails('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h3 className="text-2xl font-bold mb-6">Create New Course</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Details</label>
            <textarea value={courseDetails} onChange={(e) => setCourseDetails(e.target.value)} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
          <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;