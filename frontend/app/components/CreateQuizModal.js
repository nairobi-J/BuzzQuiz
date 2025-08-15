import { useState } from 'react';
import { X, PlusCircle, ListChecks, Clock, Award, Type, BookOpen } from 'lucide-react';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CreateQuizModal = ({ isOpen, onClose, courseID, onQuizCreated }) => {
  const [quizData, setQuizData] = useState({
    quizTitle: '',
    description: '',
    duration: 30,
    passingScore: 70,
    numQuestions: 1,
  });
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [questions, setQuestions] = useState([
    { 
      questionText: '', 
      questionType: 'multiple-choice', 
      options: ['', '', '', ''], 
      correctOption: 0,
      shortAnswer: ''
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuizChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const addQuestion = () => {
    setQuestions([...questions, { 
      questionText: '', 
      questionType: 'multiple-choice', 
      options: ['', '', '', ''], 
      correctOption: 0,
      shortAnswer: ''
    }]);
    setQuizData(prev => ({ ...prev, numQuestions: prev.numQuestions + 1 }));
  };

  const removeQuestion = (index) => {
    if (questions.length <= 1) return;
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    setQuizData(prev => ({ ...prev, numQuestions: prev.numQuestions - 1 }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    
    if (field === 'questionType') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        questionType: value,
        options: value === 'multiple-choice' ? ['', '', '', ''] : 
                value === 'true/false' ? ['True', 'False'] : [],
        correctOption: 0,
        shortAnswer: ''
      };
    } else {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        [field]: value
      };
    }
    
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Create quiz
      const quizResponse = await fetch(`${BACKEND_URL}/api/quiz/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          quizTitle: quizData.quizTitle,
          description: quizData.description,
          duration: Number(quizData.duration),
          courseID: courseID,
          numQuestions: questions.length,
          passingScore: Number(quizData.passingScore)
        })
      });

      const quizDataResponse = await quizResponse.json();
      if (!quizResponse.ok) {
        throw new Error(quizDataResponse.message || 'Failed to create quiz');
      }

      // 2. Create questions with proper validation
      const questionCreationResults = await Promise.all(
        questions.map(async (question) => {
          try {
            // Format question data based on type
            const questionPayload = {
              questionText: question.questionText.trim(),
              questionType: question.questionType,
              quizID: quizDataResponse.quiz._id
            };

            switch (question.questionType) {
              case 'multiple-choice':
                questionPayload.options = question.options
                  .map(opt => opt.trim())
                  .filter(opt => opt !== '');
                questionPayload.correctOption = question.correctOption;
                break;
              case 'true/false':
                questionPayload.options = ['True', 'False'];
                questionPayload.correctOption = question.correctOption;
                break;
              case 'short-answer':
                questionPayload.shortAnswer = question.shortAnswer.trim();
                break;
            }

            // Validate required fields
            if (!questionPayload.questionText) {
              throw new Error('Question text is required');
            }

            if ((questionPayload.questionType === 'multiple-choice' || 
                questionPayload.questionType === 'true/false') &&
                (!questionPayload.options || questionPayload.options.length < 2)) {
              throw new Error('At least two options are required');
            }

            const response = await fetch(`${BACKEND_URL}/api/question/create`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify(questionPayload)
            });

            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.message || 'Failed to create question');
            }

            return { success: true, data: result };
          } catch (error) {
            return { 
              success: false, 
              error: error.message,
              question: question.questionText
            };
          }
        })
      );

      // Check for failed questions
      const failedQuestions = questionCreationResults.filter(r => !r.success);
      if (failedQuestions.length > 0) {
        const errorMessages = failedQuestions.map(fq => 
          `"${fq.question}": ${fq.error}`
        ).join('\n');
        throw new Error(`Failed to create ${failedQuestions.length} question(s):\n${errorMessages}`);
      }

      // Refresh quizzes and close modal
      if (typeof onQuizCreated === 'function') {
        onQuizCreated();
      }
      onClose();
      
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-800">Create New Quiz</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Quiz Details */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-4 text-lg text-gray-700 flex items-center gap-3">
              <ListChecks className="text-indigo-600" size={20} /> 
              Quiz Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Type size={16} className="text-gray-500" /> Quiz Title*
                </label>
                <input
                  type="text"
                  name="quizTitle"
                  value={quizData.quizTitle}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Clock size={16} className="text-gray-500" /> Duration (minutes)*
                </label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={quizData.duration}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <Award size={16} className="text-gray-500" /> Passing Score (%)
                </label>
                <input
                  type="number"
                  name="passingScore"
                  min="1"
                  max="100"
                  value={quizData.passingScore}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              
              <div className="md:col-span-2 space-y-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <BookOpen size={16} className="text-gray-500" /> Description
                </label>
                <textarea
                  name="description"
                  value={quizData.description}
                  onChange={handleQuizChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  rows="3"
                  placeholder="Optional quiz description"
                />
              </div>
            </div>
          </div>
          
          {/* Questions Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-lg text-gray-700">
                Questions <span className="text-indigo-600">({quizData.numQuestions})</span>
              </h4>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <PlusCircle size={18} /> Add Question
              </button>
            </div>
            
            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium text-gray-700">
                      Question {qIndex + 1}
                      <span className="ml-2 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {q.questionType.replace('-', ' ')}
                      </span>
                    </h5>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove question"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Text*</label>
                      <input
                        type="text"
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="Enter your question"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Question Type*</label>
                      <select
                        value={q.questionType}
                        onChange={(e) => handleQuestionChange(qIndex, 'questionType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true/false">True/False</option>
                        <option value="short-answer">Short Answer</option>
                      </select>
                    </div>
                    
                    {q.questionType === 'multiple-choice' && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Options*</label>
                        {q.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correctOption-${qIndex}`}
                              checked={q.correctOption === oIndex}
                              onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {q.questionType === 'true/false' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Correct Answer*</label>
                        <div className="flex gap-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`correctOption-${qIndex}`}
                              checked={q.correctOption === 0}
                              onChange={() => handleQuestionChange(qIndex, 'correctOption', 0)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">True</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`correctOption-${qIndex}`}
                              checked={q.correctOption === 1}
                              onChange={() => handleQuestionChange(qIndex, 'correctOption', 1)}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="ml-2 text-gray-700">False</span>
                          </label>
                        </div>
                      </div>
                    )}
                    
                    {q.questionType === 'short-answer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer*</label>
                        <input
                          type="text"
                          value={q.shortAnswer || ''}
                          onChange={(e) => handleQuestionChange(qIndex, 'shortAnswer', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="Enter the correct answer"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition-colors font-medium flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;