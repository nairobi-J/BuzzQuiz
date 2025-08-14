'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const AddQuestionModal = ({ isOpen, onClose, quizID, onQuestionAdded }) => {
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('multiple-choice');
    const [options, setOptions] = useState([{ text: '', isCorrect: false }]);
    const [shortAnswer, setShortAnswer] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen || !quizID) return null;

    const handleOptionChange = (index, event) => {
        const newOptions = [...options];
        newOptions[index].text = event.target.value;
        setOptions(newOptions);
    };

    const handleCorrectOptionChange = (index) => {
        const newOptions = options.map((option, i) => ({
            ...option,
            isCorrect: i === index,
        }));
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { text: '', isCorrect: false }]);
    };

    const removeOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const payload = {
            questionText,
            questionType,
            quizID,
        };

        if (questionType === 'multiple-choice' || questionType === 'true/false') {
            payload.options = options.map(opt => ({
                optionText: opt.text,
                isCorrect: opt.isCorrect
            }));
        } else if (questionType === 'short answer') {
            payload.shortAnswer = { answerText: shortAnswer };
        }

        try {
            const response = await fetch('http://localhost:8000/api/question/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to create question');
            }

            const result = await response.json();
            onQuestionAdded(result.question);
            setLoading(false);
            onClose();
        } catch (error) {
            console.error('Error creating question:', error);
            setLoading(false);
            // In a real app, you would show an error alert here
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">Add a New Question</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Question Text</label>
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Question Type</label>
                        <select
                            value={questionType}
                            onChange={(e) => {
                                setQuestionType(e.target.value);
                                setOptions([{ text: '', isCorrect: false }]);
                                setShortAnswer('');
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="multiple-choice">Multiple Choice</option>
                            <option value="true/false">True/False</option>
                            <option value="short answer">Short Answer</option>
                        </select>
                    </div>

                    {(questionType === 'multiple-choice' || questionType === 'true/false') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Options</label>
                            {options.map((option, index) => (
                                <div key={index} className="mt-2 flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="correctOption"
                                        checked={option.isCorrect}
                                        onChange={() => handleCorrectOptionChange(index)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, e)}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {options.length > 1 && (
                                        <button type="button" onClick={() => removeOption(index)} className="text-red-500 hover:text-red-700">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addOption}
                                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add Option
                            </button>
                        </div>
                    )}

                    {questionType === 'short answer' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                            <input
                                type="text"
                                value={shortAnswer}
                                onChange={(e) => setShortAnswer(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                required
                            />
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Question'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddQuestionModal;