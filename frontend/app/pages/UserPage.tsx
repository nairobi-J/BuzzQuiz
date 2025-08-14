import { User } from 'lucide-react';

const UserPage = () => (
  <div className="flex flex-col items-center text-center p-8 md:p-16">
    <User className="w-24 h-24 text-yellow-300 mb-6" />
    <h3 className="text-3xl font-bold mb-4">Manage Your Profile</h3>
    <p className="text-gray-600 max-w-xl">Your personal space to update your information, view your achievements, and customize your dashboard experience.</p>
  </div>
);

export default UserPage;