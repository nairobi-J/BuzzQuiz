'use client';

import { BookOpen, MessageSquare, User, History, Settings } from 'lucide-react';

const NavLink = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200
      ${active ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
    }`}
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export default NavLink;