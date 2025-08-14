import { useState } from 'react';

export default function CreateQuizModal({ show, onClose, onSubmit }) {
  const [quizData, setQuizData] = useState({
    quizTitle: '',
    description: '',
    duration: 30,
    numQuestions: 10,
    passingScore: 7
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'numQuestions' || name === 'passingScore' 
        ? parseInt(value) 
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(quizData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Quiz</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Quiz Title</label>
              <input
                type="text"
                name="quizTitle"
                className="w-full px-3 py-2 border rounded-lg"
                value={quizData.quizTitle}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                className="w-full px-3 py-2 border rounded-lg"
                value={quizData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  name="duration"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={quizData.duration}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Questions</label>
                <input
                  type="number"
                  name="numQuestions"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={quizData.numQuestions}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Passing Score</label>
                <input
                  type="number"
                  name="passingScore"
                  className="w-full px-3 py-2 border rounded-lg"
                  value={quizData.passingScore}
                  onChange={handleChange}
                  min="1"
                  max={quizData.numQuestions}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}