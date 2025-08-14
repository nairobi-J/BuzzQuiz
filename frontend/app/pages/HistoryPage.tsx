import { History } from 'lucide-react';

const HistoryPage = () => (
  <div className="flex flex-col items-center text-center p-8 md:p-16">
    <History className="w-24 h-24 text-purple-300 mb-6" />
    <h3 className="text-3xl font-bold mb-4">Review Your Progress</h3>
    <p className="text-gray-600 max-w-xl">Keep track of your past performance, view detailed reports on your quizzes and assignments, and monitor your academic growth over time.</p>
  </div>
);

export default HistoryPage;