const validateQuestion = (req, res, next) => {
  const { questionType, questionText, options, correctOption, shortAnswer } = req.body;
  
  if (!questionText || !questionText.trim()) {
    return res.status(400).json({ message: 'Question text is required' });
  }

  if (questionType === 'multiple-choice' || questionType === 'true/false') {
    if (!options || options.length < 2) {
      return res.status(400).json({ message: 'At least two options are required' });
    }
    if (correctOption === undefined || correctOption === null) {
      return res.status(400).json({ message: 'Correct option is required' });
    }
    if (correctOption < 0 || correctOption >= options.length) {
      return res.status(400).json({ message: 'Invalid correct option index' });
    }
  }

  if (questionType === 'short-answer' && (!shortAnswer || !shortAnswer.trim())) {
    return res.status(400).json({ message: 'Short answer is required' });
  }

  next();
};

export default validateQuestion;