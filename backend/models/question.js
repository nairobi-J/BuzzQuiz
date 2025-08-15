import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { 
    type: String, 
    required: [true, 'Question text is required'],
    trim: true
  },
  questionType: { 
    type: String, 
    required: true,
    enum: {
      values: ['multiple-choice', 'true/false', 'short-answer'],
      message: 'Invalid question type'
    }
  },
  quizID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true 
  },
  options: {
    type: [String],
    validate: {
      validator: function(v) {
        // Only require options for multiple-choice and true/false questions
        if (this.questionType === 'multiple-choice' || this.questionType === 'true/false') {
          return v && v.length > 0;
        }
        return true;
      },
      message: 'Options are required for this question type'
    }
  },
  correctOption: {
    type: Number,
    validate: {
      validator: function(v) {
        // Only require correctOption for multiple-choice and true/false
        if (this.questionType === 'multiple-choice' || this.questionType === 'true/false') {
          return v !== undefined && v !== null;
        }
        return true;
      },
      message: 'Correct option is required for this question type'
    }
  },
  shortAnswer: {
    type: String,
    validate: {
      validator: function(v) {
        // Only require shortAnswer for short-answer questions
        if (this.questionType === 'short-answer') {
          return v && v.trim().length > 0;
        }
        return true;
      },
      message: 'Short answer is required for this question type'
    }
  }
}, { timestamps: true });

export const Question = mongoose.model('Question', questionSchema);
