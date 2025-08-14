import { MessageSquare } from 'lucide-react';

const Chat = () => (
  <div className="flex flex-col items-center text-center p-8 md:p-16">
    <MessageSquare className="w-24 h-24 text-green-300 mb-6" />
    <h3 className="text-3xl font-bold mb-4">Connect with Your Peers</h3>
    <p className="text-gray-600 max-w-xl">This section will be your communication hub for collaborating on projects, asking questions, and getting help from your classmates and instructors.</p>
  </div>
);

export default Chat;