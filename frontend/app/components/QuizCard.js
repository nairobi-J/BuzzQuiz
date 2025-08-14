export default function QuizCard({ quiz, onTakeQuiz }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-800">{quiz.quizTitle}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {quiz.duration} mins
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{quiz.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            {quiz.numQuestions} questions
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
            Pass: {quiz.passingScore}/{quiz.numQuestions}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <span className="text-xs font-medium">
                {quiz.creatorID?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              {quiz.creatorID?.email || 'Unknown'}
            </span>
          </div>
          
          <button
            onClick={onTakeQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
          >
            Take Exam
          </button>
        </div>
      </div>
    </div>
  );
}